'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import CodeEditor from './CodeEditor';
import TestRunner from './TestRunner';
import ScoreBoard from './ScoreBoard';
import { Sword, Users, Clock, Zap } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  code: string;
  score: number;
  testsPassedCount: number;
  isReady: boolean;
}

interface BattleState {
  players: Record<string, Player>;
  currentProblem: any;
  battleStarted: boolean;
  timeLeft: number;
  winner: string | null;
}

interface BattleArenaProps {
  roomId: string;
  playerName: string;
}

export default function BattleArena({ roomId, playerName }: BattleArenaProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [battleState, setBattleState] = useState<BattleState>({
    players: {},
    currentProblem: null,
    battleStarted: false,
    timeLeft: 300, // 5 minutes
    winner: null
  });
  const [playerId, setPlayerId] = useState<string>('');
  const [myCode, setMyCode] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Visual effects refs
  const arenaRef = useRef<HTMLDivElement>(null);
  const [screenShake, setScreenShake] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001', {
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('connected');
      
      // Join the battle room
      newSocket.emit('join-battle', { roomId, playerName });
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    // Listen for battle state updates
    newSocket.on('battle-state-update', (state: BattleState) => {
      setBattleState(state);
    });

    // Listen for player assignment
    newSocket.on('player-assigned', (id: string) => {
      setPlayerId(id);
    });

    // Listen for code updates from other players
    newSocket.on('code-update', ({ playerId: updatedPlayerId, code }: { playerId: string, code: string }) => {
      if (updatedPlayerId !== playerId) {
        setBattleState(prev => ({
          ...prev,
          players: {
            ...prev.players,
            [updatedPlayerId]: {
              ...prev.players[updatedPlayerId],
              code
            }
          }
        }));
      }
    });

    // Listen for test results
    newSocket.on('test-result', ({ playerId: testPlayerId, passed, score }: { playerId: string, passed: boolean, score: number }) => {
      if (passed) {
        triggerSuccessEffect();
      } else {
        triggerFailEffect();
      }

      setBattleState(prev => ({
        ...prev,
        players: {
          ...prev.players,
          [testPlayerId]: {
            ...prev.players[testPlayerId],
            score,
            testsPassedCount: passed ? prev.players[testPlayerId].testsPassedCount + 1 : prev.players[testPlayerId].testsPassedCount
          }
        }
      }));
    });

    // Listen for battle end
    newSocket.on('battle-ended', ({ winner }: { winner: string }) => {
      setBattleState(prev => ({ ...prev, winner, battleStarted: false }));
      triggerVictoryEffect();
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [roomId, playerName]);

  // Timer effect
  useEffect(() => {
    if (battleState.battleStarted && battleState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setBattleState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [battleState.battleStarted, battleState.timeLeft]);

  const handleCodeChange = (code: string) => {
    setMyCode(code);
    if (socket && playerId) {
      socket.emit('code-change', { roomId, playerId, code });
    }
  };

  const handleRunTests = () => {
    if (socket && playerId && myCode) {
      socket.emit('run-tests', { roomId, playerId, code: myCode });
    }
  };

  const startBattle = () => {
    if (socket) {
      socket.emit('start-battle', { roomId });
    }
  };

  // Visual effects functions
  const triggerSuccessEffect = () => {
    // Add green particles
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2000);
  };

  const triggerFailEffect = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  const triggerVictoryEffect = () => {
    // Epic victory animation
    const victoryParticles = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }));
    setParticles(victoryParticles);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playersList = Object.values(battleState.players);
  const currentPlayer = battleState.players[playerId];

  if (connectionStatus === 'connecting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">
          <Zap className="inline mr-2" />
          Connecting to Battle Arena...
        </div>
      </div>
    );
  }

  if (connectionStatus === 'disconnected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">
          Connection Lost. Refresh to rejoin the battle.
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={arenaRef}
      className={`min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 transition-transform duration-100 ${
        screenShake ? 'animate-pulse transform scale-101' : ''
      }`}
    >
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed w-2 h-2 bg-green-400 rounded-full animate-ping pointer-events-none z-50"
          style={{
            left: particle.x,
            top: particle.y,
            animationDuration: '2s'
          }}
        />
      ))}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-white text-2xl font-bold">
            <Sword className="mr-2 text-yellow-400" />
            Kode Kaisen
          </div>
          <div className="text-gray-300">Room: {roomId}</div>
        </div>

        <div className="flex items-center space-x-6 text-white">
          <div className="flex items-center">
            <Users className="mr-2" />
            {playersList.length}/2 Players
          </div>
          
          {battleState.battleStarted && (
            <div className={`flex items-center text-2xl font-mono ${
              battleState.timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-green-400'
            }`}>
              <Clock className="mr-2" />
              {formatTime(battleState.timeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* Winner Announcement */}
      {battleState.winner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-8 rounded-lg text-center animate-bounce">
            <h1 className="text-4xl font-bold mb-4">🏆 VICTORY! 🏆</h1>
            <p className="text-2xl">
              {battleState.players[battleState.winner]?.name || 'Unknown'} wins the battle!
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-black text-yellow-400 px-6 py-2 rounded font-bold hover:bg-gray-800"
            >
              New Battle
            </button>
          </div>
        </div>
      )}

      {/* Main Battle Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
        
        {/* Left Panel - Problem & Tests */}
        <div className="bg-gray-800 rounded-lg p-6 overflow-auto">
          <TestRunner 
            problem={battleState.currentProblem}
            onRunTests={handleRunTests}
            canRun={battleState.battleStarted && !!myCode}
          />
        </div>

        {/* Center Panel - Code Editor */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-4 py-2 text-white font-semibold">
            Your Code Editor
          </div>
          <CodeEditor
            value={myCode}
            onChange={handleCodeChange}
            language="javascript"
            readOnly={!battleState.battleStarted}
          />
        </div>

        {/* Right Panel - Players & Scores */}
        <div className="space-y-4">
          <ScoreBoard players={playersList} currentPlayerId={playerId} />
          
          {/* Battle Controls */}
          <div className="bg-gray-800 rounded-lg p-4">
            {!battleState.battleStarted && playersList.length === 2 && (
              <button
                onClick={startBattle}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
              >
                🚀 START BATTLE!
              </button>
            )}
            
            {!battleState.battleStarted && playersList.length < 2 && (
              <div className="text-center text-gray-400">
                Waiting for opponent...
                <div className="mt-2 animate-pulse">⚔️</div>
              </div>
            )}
          </div>

          {/* Live Code Preview of Opponent */}
          {battleState.battleStarted && playersList.length === 2 && (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="bg-red-700 px-4 py-2 text-white font-semibold">
                Opponent's Code 👁️
              </div>
              <div className="h-48 overflow-auto bg-gray-900 p-4">
                <pre className="text-green-400 text-sm font-mono">
                  {playersList.find(p => p.id !== playerId)?.code || '// Opponent is typing...'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}