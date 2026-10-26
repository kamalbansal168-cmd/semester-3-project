/* ============================================================
   LEARNPATH AI — Multiplayer Real-Time Battle Arena Engine
   Dual-Layer Synchronization: WebSockets + BroadcastChannel Fallback
   AI Bot Simulator for solo demo & realistic competition
   ============================================================ */

import { QUESTIONS_DB } from '../data/questions.js';
import { CodeExecutionEngine } from './codeExecutionEngine.js';
import { store } from '../state.js';

class BattleEngine {
  constructor() {
    this.ws = null;
    this.broadcastChannel = null;
    this.currentRoom = null;
    this.myParticipantId = null;
    this.isHost = false;
    this.listeners = new Set();
    this.botSimulationInterval = null;
    this.timerInterval = null;
    this.remainingSeconds = 0;

    this.initNetworking();
  }

  initNetworking() {
    // 1. BroadcastChannel fallback for multi-tab sync
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('learnpath_battle_bus');
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingMessage(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported:', e);
      }
    }

    // 2. WebSocket connection to server
    this.connectWebSocket();
  }

  connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('⚔️ Battle Engine connected via WebSocket');
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleIncomingMessage(msg);
        } catch (e) {
          console.error('WS Parse Error:', e);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('WS error, relying on BroadcastChannel/local state:', err);
      };

      this.ws.onclose = () => {
        // Retry connection after 3s
        setTimeout(() => this.connectWebSocket(), 3000);
      };
    } catch (e) {
      console.warn('WS not reachable:', e);
    }
  }

  send(type, payload) {
    const msg = { type, payload };
    // Send via WebSocket if open
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
    // Also broadcast via BroadcastChannel for zero-latency local tab sync
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch (e) {}
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(eventType, data) {
    this.listeners.forEach((listener) => {
      try {
        listener(eventType, data);
      } catch (err) {
        console.error('Listener error:', err);
      }
    });
  }

  handleIncomingMessage(msg) {
    const { type, payload } = msg;

    switch (type) {
      case 'ROOM_CREATED':
      case 'ROOM_JOINED':
        this.currentRoom = payload.room;
        if (payload.yourId) this.myParticipantId = payload.yourId;
        this.isHost = (this.currentRoom.hostId === this.myParticipantId);
        this.emit('ROOM_UPDATED', this.currentRoom);
        break;

      case 'PARTICIPANT_JOINED':
        if (this.currentRoom && this.currentRoom.code === payload.room.code) {
          this.currentRoom = payload.room;
          this.emit('PARTICIPANT_JOINED', payload.participant);
          this.emit('ROOM_UPDATED', this.currentRoom);
        }
        break;

      case 'PARTICIPANT_LEFT':
        if (this.currentRoom) {
          this.currentRoom = payload.room;
          this.emit('ROOM_UPDATED', this.currentRoom);
        }
        break;

      case 'BATTLE_STARTED':
        if (this.currentRoom && this.currentRoom.code === payload.room.code) {
          this.currentRoom = payload.room;
          this.startLocalBattleCountdown();
          this.startBotSimulation();
          this.emit('BATTLE_STARTED', this.currentRoom);
        }
        break;

      case 'PROGRESS_UPDATED':
        if (this.currentRoom) {
          this.currentRoom.participants = payload.participants;
          this.emit('PROGRESS_UPDATED', {
            participantId: payload.participantId,
            participant: payload.participant,
            feedItem: payload.feedItem,
            participants: payload.participants
          });
        }
        break;

      case 'BATTLE_FINISHED':
        if (this.currentRoom) {
          this.currentRoom = payload.room;
          this.stopTimers();
          this.finalizeBattle();
          this.emit('BATTLE_FINISHED', this.currentRoom);
        }
        break;

      case 'ERROR':
        this.emit('ERROR', payload.message);
        break;
    }
  }

  // Generate question set matching topic & difficulty settings
  pickQuestions(topic = 'all', difficulty = 'all', mcqCount = 2, codingCount = 1) {
    let pool = [...QUESTIONS_DB];

    if (topic && topic !== 'all') {
      pool = pool.filter((q) => q.topic === topic);
      if (pool.length === 0) pool = [...QUESTIONS_DB]; // fallback if not enough
    }

    if (difficulty && difficulty !== 'all') {
      const diffFiltered = pool.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      if (diffFiltered.length >= (mcqCount + codingCount)) {
        pool = diffFiltered;
      }
    }

    const mcqPool = pool.filter((q) => q.type === 'MCQ');
    const codingPool = pool.filter((q) => q.type === 'CODING');

    // Shuffle helper
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const selectedMcqs = shuffle(mcqPool).slice(0, Math.min(mcqCount, mcqPool.length));
    const selectedCoding = shuffle(codingPool).slice(0, Math.min(codingCount, codingPool.length));

    // Fallbacks if not enough in topic
    if (selectedMcqs.length < mcqCount) {
      const allMcqs = QUESTIONS_DB.filter((q) => q.type === 'MCQ' && !selectedMcqs.some(s => s.id === q.id));
      selectedMcqs.push(...shuffle(allMcqs).slice(0, mcqCount - selectedMcqs.length));
    }

    if (selectedCoding.length < codingCount) {
      const allCoding = QUESTIONS_DB.filter((q) => q.type === 'CODING' && !selectedCoding.some(s => s.id === q.id));
      selectedCoding.push(...shuffle(allCoding).slice(0, codingCount - selectedCoding.length));
    }

    return [...selectedMcqs, ...selectedCoding];
  }

  createRoom({
    name,
    maxParticipants = 10,
    topic = 'all',
    difficulty = 'all',
    mcqCount = 2,
    codingCount = 1,
    timeLimitMinutes = 10,
    hostName,
    hostAvatar
  }) {
    const code = 'BATTLE-' + Math.floor(1000 + Math.random() * 9000);
    this.myParticipantId = 'host_' + Math.random().toString(36).substring(2, 8);
    this.isHost = true;

    const questions = this.pickQuestions(topic, difficulty, mcqCount, codingCount);

    const roomPayload = {
      code,
      name: name || `Arena #${code.slice(-4)}`,
      hostId: this.myParticipantId,
      hostName: hostName || 'You (Host)',
      hostAvatar: hostAvatar || '👑',
      maxParticipants: parseInt(maxParticipants) || 10,
      topic,
      difficulty,
      mcqCount: parseInt(mcqCount),
      codingCount: parseInt(codingCount),
      timeLimitMinutes: parseInt(timeLimitMinutes),
      questions
    };

    // Optimistic local room setup
    this.currentRoom = {
      ...roomPayload,
      status: 'LOBBY',
      participants: [{
        id: this.myParticipantId,
        name: roomPayload.hostName,
        avatar: roomPayload.hostAvatar,
        isHost: true,
        isBot: false,
        score: 0,
        solvedCount: 0,
        currentQIdx: 0,
        status: 'Ready in Lobby',
        testCasesPassed: 0,
        lastActivity: 'Room created'
      }]
    };

    this.send('CREATE_ROOM', roomPayload);
    this.emit('ROOM_UPDATED', this.currentRoom);
    return this.currentRoom;
  }

  joinRoom(code, name, avatar) {
    const participantId = 'p_' + Math.random().toString(36).substring(2, 9);
    this.myParticipantId = participantId;
    this.isHost = false;

    this.send('JOIN_ROOM', {
      code: code.trim().toUpperCase(),
      participantId,
      name: name || 'Player',
      avatar: avatar || '⚔️'
    });
  }

  addBot() {
    if (!this.currentRoom) return;
    this.send('ADD_BOT', { code: this.currentRoom.code });
  }

  addMultipleBots(count = 5) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => this.addBot(), i * 150);
    }
  }

  startBattle() {
    if (!this.currentRoom || !this.isHost) return;
    this.send('START_BATTLE', {
      code: this.currentRoom.code,
      hostId: this.myParticipantId,
      questions: this.currentRoom.questions
    });
  }

  startLocalBattleCountdown() {
    this.stopTimers();
    this.remainingSeconds = (this.currentRoom.timeLimitMinutes || 10) * 60;

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      this.emit('TIMER_TICK', { remainingSeconds: this.remainingSeconds });

      if (this.remainingSeconds <= 0) {
        this.stopTimers();
        this.finishBattle();
      }
    }, 1000);
  }

  // Realistic AI bot simulation during battle
  startBotSimulation() {
    if (this.botSimulationInterval) clearInterval(this.botSimulationInterval);
    if (!this.currentRoom || !this.currentRoom.questions) return;

    const questions = this.currentRoom.questions;

    this.botSimulationInterval = setInterval(() => {
      if (!this.currentRoom || this.currentRoom.status !== 'IN_BATTLE') {
        clearInterval(this.botSimulationInterval);
        return;
      }

      // Pick a random bot
      const bots = this.currentRoom.participants.filter((p) => p.isBot && p.solvedCount < questions.length);
      if (bots.length === 0) return;

      const bot = bots[Math.floor(Math.random() * bots.length)];
      const currentQ = questions[bot.currentQIdx];
      if (!currentQ) return;

      // Bot progression action
      const isMcq = currentQ.type === 'MCQ';
      const isPassing = Math.random() > 0.15; // 85% accuracy

      if (isMcq) {
        if (isPassing) {
          bot.score += 100 + Math.floor(Math.random() * 30);
          bot.solvedCount++;
          bot.currentQIdx = Math.min(bot.currentQIdx + 1, questions.length - 1);
          bot.status = `✅ Solved Q${bot.solvedCount}`;
          bot.lastActivity = `Solved MCQ (+120 pts)`;
        } else {
          bot.status = `❌ Missed Q${bot.currentQIdx + 1}, retrying`;
          bot.lastActivity = `Failed MCQ`;
        }
      } else {
        // Coding question
        const totalCases = currentQ.testCases ? currentQ.testCases.length : 3;
        if (isPassing) {
          bot.testCasesPassed = totalCases;
          bot.score += 250 + Math.floor(Math.random() * 60);
          bot.solvedCount++;
          bot.currentQIdx = Math.min(bot.currentQIdx + 1, questions.length - 1);
          bot.status = `🎉 Solved Code (${totalCases}/${totalCases})`;
          bot.lastActivity = `Passed all test cases! (+300 pts)`;
        } else {
          const passed = Math.floor(Math.random() * (totalCases - 1)) + 1;
          bot.testCasesPassed = passed;
          bot.status = `⚙️ Debugging (${passed}/${totalCases} passed)`;
          bot.lastActivity = `Running test cases...`;
        }
      }

      this.currentRoom.participants.sort((a, b) => b.score - a.score);

      this.emit('PROGRESS_UPDATED', {
        participantId: bot.id,
        participant: bot,
        feedItem: `${bot.name} ${bot.lastActivity}`,
        participants: this.currentRoom.participants
      });

      // Check if all bots & players finished
      const allDone = this.currentRoom.participants.every((p) => p.solvedCount >= questions.length);
      if (allDone) {
        this.finishBattle();
      }
    }, 4500); // Trigger every 4.5s for dynamic live leaderboard updates
  }

  submitMcqAnswer(questionId, selectedIdx) {
    if (!this.currentRoom || !this.myParticipantId) return null;
    const q = this.currentRoom.questions.find((item) => item.id === questionId);
    if (!q) return null;

    const me = this.currentRoom.participants.find((p) => p.id === this.myParticipantId);
    if (!me) return null;

    const isCorrect = (selectedIdx === q.correct_answer);
    let ptsEarned = 0;

    if (isCorrect) {
      // Speed bonus: up to 50 extra points if solved fast
      const speedBonus = Math.floor(Math.min(50, (this.remainingSeconds / 60) * 10));
      ptsEarned = 100 + speedBonus;
      me.score += ptsEarned;
      me.solvedCount++;
      me.status = `✅ Solved Q${me.solvedCount}`;
      me.lastActivity = `Solved Q${me.currentQIdx + 1} (+${ptsEarned} pts)`;
    } else {
      me.status = `❌ Missed Q${me.currentQIdx + 1}`;
      me.lastActivity = `Wrong answer on Q${me.currentQIdx + 1}`;
    }

    this.broadcastMyProgress(me, isCorrect ? `You solved Q${me.currentQIdx + 1} (+${ptsEarned} pts)!` : `Incorrect answer on Q${me.currentQIdx + 1}`);

    return { isCorrect, correctAnswer: q.correct_answer, explanation: q.explanation, ptsEarned };
  }

  runCode(question, code) {
    return CodeExecutionEngine.runTestCases(question, code, false);
  }

  submitCode(question, code) {
    if (!this.currentRoom || !this.myParticipantId) return null;
    const me = this.currentRoom.participants.find((p) => p.id === this.myParticipantId);
    if (!me) return null;

    const evalResult = CodeExecutionEngine.runTestCases(question, code, true);
    const passedCount = evalResult.passedCount || 0;
    const totalCount = evalResult.totalCount || (question.testCases ? question.testCases.length : 3);
    const isAllPassed = evalResult.success || (passedCount === totalCount && totalCount > 0);

    me.testCasesPassed = passedCount;

    let ptsEarned = 0;
    if (isAllPassed) {
      const speedBonus = Math.floor(Math.min(80, (this.remainingSeconds / 60) * 15));
      ptsEarned = 250 + speedBonus;
      me.score += ptsEarned;
      me.solvedCount++;
      me.status = `🎉 Solved Code (${passedCount}/${totalCount})`;
      me.lastActivity = `Passed all ${totalCount} test cases! (+${ptsEarned} pts)`;
    } else {
      ptsEarned = passedCount * 30; // partial credit
      me.score += ptsEarned;
      me.status = `⚙️ Passed ${passedCount}/${totalCount} cases`;
      me.lastActivity = `Passed ${passedCount}/${totalCount} test cases`;
    }

    this.broadcastMyProgress(me, `${me.name} ${me.lastActivity}`);

    return { ...evalResult, ptsEarned, isAllPassed };
  }

  broadcastMyProgress(me, feedText = null) {
    this.send('UPDATE_PROGRESS', {
      code: this.currentRoom.code,
      participantId: me.id,
      score: me.score,
      solvedCount: me.solvedCount,
      currentQIdx: me.currentQIdx,
      status: me.status,
      testCasesPassed: me.testCasesPassed,
      lastActivity: me.lastActivity,
      feedItem: feedText
    });
  }

  finishBattle() {
    this.stopTimers();
    if (this.currentRoom) {
      this.currentRoom.status = 'FINISHED';
      this.send('FINISH_BATTLE', { code: this.currentRoom.code });
      this.finalizeBattle();
      this.emit('BATTLE_FINISHED', this.currentRoom);
    }
  }

  finalizeBattle() {
    if (!this.currentRoom) return;
    // Sort final rankings
    this.currentRoom.participants.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.solvedCount - a.solvedCount;
    });

    // Award XP to user's main profile in store
    const me = this.currentRoom.participants.find((p) => p.id === this.myParticipantId);
    if (me && me.score > 0) {
      const state = store.getState();
      const newPoints = (state.user.points || 0) + me.score;
      store.setState({
        user: {
          ...state.user,
          points: newPoints
        }
      });
    }
  }

  stopTimers() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.botSimulationInterval) {
      clearInterval(this.botSimulationInterval);
      this.botSimulationInterval = null;
    }
  }

  leaveRoom() {
    this.stopTimers();
    this.currentRoom = null;
    this.myParticipantId = null;
    this.isHost = false;
    this.emit('ROOM_LEFT', null);
  }
}

export const battleEngine = new BattleEngine();
