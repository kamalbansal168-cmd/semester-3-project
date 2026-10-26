const http = require('http');
const fs = require('fs');
const path = require('path');
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

server.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`LEARNPATH AI Platform running successfully!`);
  console.log(`Open in your browser: http://localhost:${PORT}`);
  console.log(`⚔️ Real-Time Multiplayer Battle Arena WebSocket: ACTIVE`);
  console.log(`Tagline: "Understand your mistakes. Improve your concepts."`);
  console.log(`============================================================\n`);
});
