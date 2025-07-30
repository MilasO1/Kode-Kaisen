// server.ts
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { problems } from './src/lib/problems';
import { executeCode } from './src/lib/codeExecutor';

const app = express();
app.use(cors());
const httpServer = createServer(app);

// Minimal type definitions specific to server
type RoomState = {
  players: Record<string, {
    id: string;
    name: string;
    code: string;
    score: number;
    testsPassedCount: number;
    isReady: boolean;
  }>;
  problem: typeof problems[0] | null;
  battleStarted: boolean;
  timeLeft: number;
  winner: string | null;
};

// Add type for execution result
type ExecutionResult = {
  status?: {
    id: number;
    description?: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
};

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map<string, RoomState>();

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('join-battle', (data: { roomId: string; playerName: string }) => {
    const { roomId, playerName } = data;
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        players: {},
        problem: problems[0],
        battleStarted: false,
        timeLeft: 300,
        winner: null
      });
    }

    const room = rooms.get(roomId)!;
    
    room.players[socket.id] = {
      id: socket.id,
      name: playerName,
      code: room.problem?.starterCode || '',
      score: 0,
      testsPassedCount: 0,
      isReady: true
    };

    socket.join(roomId);
    socket.emit('player-assigned', socket.id);
    io.to(roomId).emit('battle-state-update', room);
  });

  socket.on('code-change', (data: { roomId: string; playerId: string; code: string }) => {
    const { roomId, playerId, code } = data;
    const room = rooms.get(roomId);
    if (!room) return;

    room.players[playerId].code = code;
    socket.to(roomId).emit('code-update', { playerId, code });
    io.to(roomId).emit('battle-state-update', room);
  });

  socket.on('run-tests', async (data: { roomId: string; playerId: string; code: string }) => {
    const { roomId, playerId, code } = data;
    const room = rooms.get(roomId);
    if (!room || !room.battleStarted || !room.problem) return;

    try {
      const results = await executeCode(code, room.problem.testCases);
      
      let passedCount = 0;
      results.forEach((result: ExecutionResult) => {
        const passed = result.status?.id === 3;
        if (passed) passedCount++;
        socket.emit('test-result', {
          playerId,
          passed,
          score: passed ? room.players[playerId].score + 10 : room.players[playerId].score
        });
      });

      room.players[playerId].testsPassedCount = passedCount;
      room.players[playerId].score += passedCount * 10;

      if (passedCount === room.problem.testCases.length) {
        room.winner = playerId;
        room.battleStarted = false;
        io.to(roomId).emit('battle-ended', { winner: playerId });
      }

      io.to(roomId).emit('battle-state-update', room);
    } catch (error) {
      console.error('Code execution error:', error);
    }
  });

  socket.on('start-battle', (data: { roomId: string }) => {
    const { roomId } = data;
    const room = rooms.get(roomId);
    if (!room || Object.keys(room.players).length < 2) return;

    room.battleStarted = true;
    room.timeLeft = 300;
    room.winner = null;

    const timer = setInterval(() => {
      room.timeLeft--;
      
      if (room.timeLeft <= 0) {
        clearInterval(timer);
        room.battleStarted = false;
        
        const players = Object.values(room.players);
        if (players.length > 0) {
          players.sort((a, b) => b.score - a.score);
          room.winner = players[0].id;
          io.to(roomId).emit('battle-ended', { winner: room.winner });
        }
      }

      io.to(roomId).emit('battle-state-update', room);
    }, 1000);

    io.to(roomId).emit('battle-state-update', room);
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      if (room.players[socket.id]) {
        delete room.players[socket.id];
        
        if (Object.keys(room.players).length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('battle-state-update', room);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
