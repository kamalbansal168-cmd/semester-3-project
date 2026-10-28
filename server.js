const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const { WebSocketServer } = require('ws');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Real Code Execution API (JVM / Python / Node.js)
  if (req.url === '/api/execute' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        executeUserCode(payload, res);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Malformed JSON payload: ' + err.message }));
      }
    });
    return;
  }

  // Prevent directory traversal
  const rawPath = req.url === '/' ? 'index.html' : req.url.split('?')[0];
  const safeFilePath = path.normalize(path.join(__dirname, rawPath));

  // Security check: block requests that escape the project root
  if (!safeFilePath.startsWith(path.normalize(__dirname + path.sep))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  const filePath = safeFilePath;
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      // Development: disable caching for JS, CSS, and HTML to always serve fresh edits
      if (ext === '.js' || ext === '.html' || ext === '.css') {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        });
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
      }
      res.end(content, 'utf-8');
    }
  });
});

// ============================================================
// REAL-TIME BATTLE ARENA WEBSOCKET SERVER
// ============================================================
const wss = new WebSocketServer({ server });
const rooms = new Map(); // roomCode -> Room Object

function broadcastToRoom(roomCode, payload, excludeWs = null) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const msg = JSON.stringify(payload);
  room.clients.forEach((clientWs) => {
    if (clientWs !== excludeWs && clientWs.readyState === 1) { // 1 = OPEN
      clientWs.send(msg);
    }
  });
}

function getSanitizedRoom(room) {
  return {
    code: room.code,
    name: room.name,
    hostId: room.hostId,
    maxParticipants: room.maxParticipants,
    topic: room.topic,
    difficulty: room.difficulty,
    mcqCount: room.mcqCount,
    codingCount: room.codingCount,
    timeLimitMinutes: room.timeLimitMinutes,
    status: room.status,
    startedAt: room.startedAt,
    endsAt: room.endsAt,
    questions: room.questions || [],
    participants: Array.from(room.participants.values())
  };
}

wss.on('connection', (ws) => {
  let currentRoomCode = null;
  let currentParticipantId = null;

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      const { type, payload } = msg;

      switch (type) {
        case 'CREATE_ROOM': {
          const roomCode = payload.code || ('ROOM-' + Math.floor(1000 + Math.random() * 9000));
          const room = {
            code: roomCode,
            name: payload.name || `Battle #${roomCode.slice(-4)}`,
            hostId: payload.hostId,
            maxParticipants: parseInt(payload.maxParticipants) || 10,
            topic: payload.topic || 'all',
            difficulty: payload.difficulty || 'all',
            mcqCount: parseInt(payload.mcqCount) || 2,
            codingCount: parseInt(payload.codingCount) || 1,
            timeLimitMinutes: parseInt(payload.timeLimitMinutes) || 10,
            status: 'LOBBY',
            questions: payload.questions || [],
            startedAt: null,
            endsAt: null,
            participants: new Map(),
            clients: new Set()
          };

          const hostParticipant = {
            id: payload.hostId,
            name: payload.hostName || 'Host',
            avatar: payload.hostAvatar || '👑',
            isHost: true,
            isBot: false,
            score: 0,
            solvedCount: 0,
            currentQIdx: 0,
            status: 'Ready in Lobby',
            testCasesPassed: 0,
            lastActivity: 'Joined room'
          };

          room.participants.set(payload.hostId, hostParticipant);
          room.clients.add(ws);
          rooms.set(roomCode, room);

          currentRoomCode = roomCode;
          currentParticipantId = payload.hostId;

          ws.send(JSON.stringify({
            type: 'ROOM_CREATED',
            payload: { room: getSanitizedRoom(room), yourId: payload.hostId }
          }));
          break;
        }

        case 'JOIN_ROOM': {
          const room = rooms.get(payload.code);
          if (!room) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: { message: `Room "${payload.code}" not found!` } }));
            return;
          }
          if (room.status !== 'LOBBY') {
            ws.send(JSON.stringify({ type: 'ERROR', payload: { message: `Battle in ${payload.code} has already started!` } }));
            return;
          }
          if (room.participants.size >= room.maxParticipants) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: { message: `Room is full (max ${room.maxParticipants} players).` } }));
            return;
          }

          const participant = {
            id: payload.participantId || ('p_' + Math.random().toString(36).substring(2, 9)),
            name: payload.name || `Player ${room.participants.size + 1}`,
            avatar: payload.avatar || '⚔️',
            isHost: false,
            isBot: false,
            score: 0,
            solvedCount: 0,
            currentQIdx: 0,
            status: 'Ready in Lobby',
            testCasesPassed: 0,
            lastActivity: 'Joined lobby'
          };

          room.participants.set(participant.id, participant);
          room.clients.add(ws);

          currentRoomCode = payload.code;
          currentParticipantId = participant.id;

          ws.send(JSON.stringify({
            type: 'ROOM_JOINED',
            payload: { room: getSanitizedRoom(room), yourId: participant.id }
          }));

          broadcastToRoom(room.code, {
            type: 'PARTICIPANT_JOINED',
            payload: { participant, room: getSanitizedRoom(room) }
          }, ws);
          break;
        }

        case 'ADD_BOT': {
          const room = rooms.get(payload.code);
          if (!room || room.status !== 'LOBBY') return;
          if (room.participants.size >= room.maxParticipants) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: { message: `Room is full.` } }));
            return;
          }

          const botNames = ['Bot_Arya', 'Bot_Rohan', 'Bot_Priya', 'Bot_Kabir', 'Bot_Neha', 'Bot_Dev', 'Bot_Zoya', 'Bot_Vikram', 'Bot_Ananya', 'Bot_Karan'];
          const botAvatars = ['🤖', '⚡', '🔥', '🛡️', '🎯', '🚀', '💎', '🧠', '👾', '🦊'];
          const botIdx = room.participants.size % botNames.length;
          const botId = 'bot_' + Math.random().toString(36).substring(2, 8);

          const botParticipant = {
            id: botId,
            name: botNames[botIdx] + `_${Math.floor(Math.random() * 90 + 10)}`,
            avatar: botAvatars[botIdx],
            isHost: false,
            isBot: true,
            score: 0,
            solvedCount: 0,
            currentQIdx: 0,
            status: 'AI Bot Ready',
            testCasesPassed: 0,
            lastActivity: 'AI bot joined'
          };

          room.participants.set(botId, botParticipant);
          broadcastToRoom(room.code, {
            type: 'PARTICIPANT_JOINED',
            payload: { participant: botParticipant, room: getSanitizedRoom(room) }
          });
          break;
        }

        case 'START_BATTLE': {
          const room = rooms.get(payload.code);
          if (!room) return;
          if (room.hostId !== payload.hostId) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: { message: 'Only the host can start the battle!' } }));
            return;
          }

          room.status = 'IN_BATTLE';
          room.startedAt = Date.now();
          room.endsAt = Date.now() + (room.timeLimitMinutes * 60 * 1000);
          if (payload.questions && payload.questions.length > 0) {
            room.questions = payload.questions;
          }

          broadcastToRoom(room.code, {
            type: 'BATTLE_STARTED',
            payload: { room: getSanitizedRoom(room) }
          });
          break;
        }

        case 'UPDATE_PROGRESS': {
          const room = rooms.get(payload.code);
          if (!room) return;
          const participant = room.participants.get(payload.participantId);
          if (participant) {
            if (payload.status) participant.status = payload.status;
            if (payload.currentQIdx !== undefined) participant.currentQIdx = payload.currentQIdx;
            if (payload.testCasesPassed !== undefined) participant.testCasesPassed = payload.testCasesPassed;
            if (payload.score !== undefined) participant.score = payload.score;
            if (payload.solvedCount !== undefined) participant.solvedCount = payload.solvedCount;
            if (payload.lastActivity) participant.lastActivity = payload.lastActivity;

            broadcastToRoom(room.code, {
              type: 'PROGRESS_UPDATED',
              payload: {
                participantId: participant.id,
                participant,
                feedItem: payload.feedItem || null,
                participants: Array.from(room.participants.values())
              }
            });
          }
          break;
        }

        case 'FINISH_BATTLE': {
          const room = rooms.get(payload.code);
          if (!room) return;
          room.status = 'FINISHED';
          broadcastToRoom(room.code, {
            type: 'BATTLE_FINISHED',
            payload: { room: getSanitizedRoom(room) }
          });
          break;
        }

        case 'GET_ACTIVE_ROOMS': {
          const activeList = [];
          rooms.forEach((r) => {
            if (r.status === 'LOBBY' && r.participants.size < r.maxParticipants) {
              activeList.push({
                code: r.code,
                name: r.name,
                topic: r.topic,
                difficulty: r.difficulty,
                playerCount: r.participants.size,
                maxParticipants: r.maxParticipants,
                timeLimitMinutes: r.timeLimitMinutes
              });
            }
          });
          ws.send(JSON.stringify({ type: 'ACTIVE_ROOMS_LIST', payload: { rooms: activeList } }));
          break;
        }
      }
    } catch (err) {
      console.error('WebSocket Error:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoomCode && currentParticipantId) {
      const room = rooms.get(currentRoomCode);
      if (room) {
        room.clients.delete(ws);
        const p = room.participants.get(currentParticipantId);
        if (p && !p.isBot) {
          p.status = 'Disconnected';
          broadcastToRoom(currentRoomCode, {
            type: 'PARTICIPANT_LEFT',
            payload: { participantId: currentParticipantId, room: getSanitizedRoom(room) }
          });
        }
        // If room is empty of human clients, clean it up after 5 minutes
        if (room.clients.size === 0) {
          setTimeout(() => {
            if (room.clients.size === 0) rooms.delete(currentRoomCode);
          }, 300000);
        }
      }
    }
  });
});

// ============================================================
// REAL CODE EXECUTION ENGINE (JVM HotSpot / Python / Node)
// ============================================================
function executeUserCode(payload, res) {
  const { code = '', language = 'java', stdin = '', fileName = 'Main.java' } = payload;
  const startTime = Date.now();

  const runId = 'run_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
  const tempDir = path.join(__dirname, '.temp_runs', runId);
  try {
    fs.mkdirSync(tempDir, { recursive: true });
  } catch (e) {}

  const cleanup = () => {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (e) {}
  };

  const sendResponse = (result) => {
    cleanup();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    });
    res.end(JSON.stringify({
      ...result,
      executionTimeMs: Date.now() - startTime
    }));
  };

  const lang = (language || '').toLowerCase();

  // 1. JAVA: Compiles with javac and runs on Real JVM (HotSpot)
  if (lang === 'java') {
    let className = 'Main';
    const match = code.match(/(?:public\s+)?(?:final\s+)?class\s+([A-Za-z0-9_]+)/);
    if (match && match[1]) {
      className = match[1];
    } else if (fileName && fileName.endsWith('.java')) {
      className = path.basename(fileName, '.java');
    }

    const sourceFile = path.join(tempDir, `${className}.java`);
    fs.writeFileSync(sourceFile, code, 'utf-8');

    // Step A: Compilation with javac
    exec(`javac "${className}.java"`, { cwd: tempDir, timeout: 8000 }, (compileErr, compileStdout, compileStderr) => {
      if (compileErr) {
        const errText = compileStderr || compileStdout || compileErr.message;
        return sendResponse({
          success: false,
          stdout: '',
          error: errText.trim(),
          stage: 'Compilation Error',
          runtime: 'JVM 25.0.1 (HotSpot)'
        });
      }

      // Step B: Execution with java (Real JVM)
      let stdout = '';
      let stderr = '';
      let isTimedOut = false;

      const child = spawn('java', [className], { cwd: tempDir });

      const timer = setTimeout(() => {
        isTimedOut = true;
        try { child.kill('SIGKILL'); } catch (e) {}
      }, 7000);

      if (stdin) {
        try {
          child.stdin.write(stdin);
          child.stdin.end();
        } catch (e) {}
      } else {
        child.stdin.end();
      }

      child.stdout.on('data', d => { stdout += d.toString(); });
      child.stderr.on('data', d => { stderr += d.toString(); });

      child.on('error', (err) => {
        clearTimeout(timer);
        sendResponse({
          success: false,
          stdout,
          error: `JVM Runtime Process Error: ${err.message}`,
          stage: 'Runtime',
          runtime: 'JVM 25.0.1 (HotSpot)'
        });
      });

      child.on('close', (exitCode) => {
        clearTimeout(timer);
        if (isTimedOut) {
          return sendResponse({
            success: false,
            stdout: stdout.trimEnd(),
            error: 'Time Limit Exceeded: Process exceeded 7000ms execution limit.',
            stage: 'Timeout',
            runtime: 'JVM 25.0.1 (HotSpot)'
          });
        }

        const isSuccess = exitCode === 0;
        sendResponse({
          success: isSuccess,
          stdout: stdout.trimEnd(),
          error: isSuccess ? null : (stderr.trim() || `Process exited with error code ${exitCode}`),
          stage: isSuccess ? 'Success' : 'Runtime Exception',
          runtime: 'JVM 25.0.1 (HotSpot)',
          exitCode
        });
      });
    });
    return;
  }

  // 2. PYTHON: Runs using py / python3
  if (lang === 'py' || lang === 'python') {
    const scriptFile = path.join(tempDir, 'script.py');
    fs.writeFileSync(scriptFile, code, 'utf-8');

    let stdout = '';
    let stderr = '';
    let isTimedOut = false;

    const pyCmd = process.platform === 'win32' ? 'py' : 'python3';
    const child = spawn(pyCmd, ['script.py'], { cwd: tempDir });

    const timer = setTimeout(() => {
      isTimedOut = true;
      try { child.kill('SIGKILL'); } catch (e) {}
    }, 7000);

    if (stdin) {
      try { child.stdin.write(stdin); child.stdin.end(); } catch (e) {}
    } else {
      child.stdin.end();
    }

    child.stdout.on('data', d => { stdout += d.toString(); });
    child.stderr.on('data', d => { stderr += d.toString(); });

    child.on('close', (exitCode) => {
      clearTimeout(timer);
      if (isTimedOut) {
        return sendResponse({
          success: false,
          stdout: stdout.trimEnd(),
          error: 'Time Limit Exceeded: Process exceeded 7000ms limit.',
          runtime: 'Python 3'
        });
      }
      const isSuccess = exitCode === 0;
      sendResponse({
        success: isSuccess,
        stdout: stdout.trimEnd(),
        error: isSuccess ? null : (stderr.trim() || `Process exited with code ${exitCode}`),
        runtime: 'Python 3',
        exitCode
      });
    });
    return;
  }

  // 3. JAVASCRIPT / NODE.JS
  if (lang === 'js' || lang === 'javascript' || lang === 'node') {
    const scriptFile = path.join(tempDir, 'script.js');
    fs.writeFileSync(scriptFile, code, 'utf-8');

    let stdout = '';
    let stderr = '';
    let isTimedOut = false;

    const child = spawn(process.execPath, ['script.js'], { cwd: tempDir });

    const timer = setTimeout(() => {
      isTimedOut = true;
      try { child.kill('SIGKILL'); } catch (e) {}
    }, 7000);

    if (stdin) {
      try { child.stdin.write(stdin); child.stdin.end(); } catch (e) {}
    } else {
      child.stdin.end();
    }

    child.stdout.on('data', d => { stdout += d.toString(); });
    child.stderr.on('data', d => { stderr += d.toString(); });

    child.on('close', (exitCode) => {
      clearTimeout(timer);
      if (isTimedOut) {
        return sendResponse({
          success: false,
          stdout: stdout.trimEnd(),
          error: 'Time Limit Exceeded (7000ms).',
          runtime: 'Node.js'
        });
      }
      const isSuccess = exitCode === 0;
      sendResponse({
        success: isSuccess,
        stdout: stdout.trimEnd(),
        error: isSuccess ? null : (stderr.trim() || `Process exited with code ${exitCode}`),
        runtime: 'Node.js',
        exitCode
      });
    });
    return;
  }

  sendResponse({
    success: false,
    error: `Language '${language}' is not supported yet by real execution engine.`,
    runtime: 'Unknown'
  });
}

server.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`LEARNPATH AI Platform running successfully!`);
  console.log(`Open in your browser: http://localhost:${PORT}`);
  console.log(`⚔️ Real-Time Multiplayer Battle Arena WebSocket: ACTIVE`);
  console.log(`⚡ Real-Time JVM & Compiler Execution API: ACTIVE (Java 25.0.1)`);
  console.log(`Tagline: "Understand your mistakes. Improve your concepts."`);
  console.log(`============================================================\n`);
});
