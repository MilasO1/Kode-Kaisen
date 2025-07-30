'use client';

import { Crown, User, Zap, Target, Clock, Code } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  code: string;
  score: number;
  testsPassedCount: number;
  isReady: boolean;
}

interface ScoreBoardProps {
  players: Player[];
  currentPlayerId: string;
}

export default function ScoreBoard({ players, currentPlayerId }: ScoreBoardProps) {
  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  const getPlayerRank = (playerId: string) => {
    return sortedPlayers.findIndex(p => p.id === playerId) + 1;
  };

  const getTypingSpeed = (player: Player) => {
    // Simple metric: characters per "minute" (just length of code)
    return player.code.length;
  };

  const getProgressPercentage = (player: Player) => {
    // Assuming max score is 100 for visualization
    return Math.min((player.score / 100) * 100, 100);
  };

  // Calculate average speed safely
  const averageSpeed = players.length > 0 
    ? Math.round(players.reduce((acc, p) => acc + getTypingSpeed(p), 0) / players.length)
    : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center">
        <Crown className="mr-2 text-yellow-400" />
        Battle Leaderboard
      </h3>

      <div className="space-y-4">
        {sortedPlayers.map((player, index) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          const rank = index + 1;
          const progressPercentage = getProgressPercentage(player);
          
          return (
            <div
              key={player.id}
              className={`relative p-4 rounded-lg border transition-all duration-300 ${
                isCurrentPlayer 
                  ? 'border-yellow-400 bg-gray-700 bg-opacity-50' 
                  : 'border-gray-600 bg-gray-700'
              }`}
            >
              {/* Rank Badge */}
              <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                rank === 1 
                  ? 'bg-yellow-500 text-black' 
                  : rank === 2 
                    ? 'bg-gray-400 text-black' 
                    : 'bg-gray-600 text-white'
              }`}>
                {rank}
              </div>

              {/* Player Info */}
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCurrentPlayer ? 'bg-yellow-500 text-black' : 'bg-purple-600 text-white'
                  }`}>
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${
                      isCurrentPlayer ? 'text-yellow-400' : 'text-white'
                    }`}>
                      {player.name}
                      {isCurrentPlayer && <span className="ml-2 text-xs">(YOU)</span>}
                    </h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                      <span className="flex items-center">
                        <Target className="mr-1" size={14} />
                        {player.testsPassedCount} passed
                      </span>
                      <span className="flex items-center">
                        <Code className="mr-1" size={14} />
                        {getTypingSpeed(player)} chars
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-yellow-400">
                  {player.score} pts
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="h-2 w-full bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Battle Stats */}
      <div className="mt-6 bg-gray-700 rounded-lg p-3">
        <h4 className="text-white font-semibold mb-2 flex items-center">
          <Zap className="mr-2 text-yellow-400" size={18} />
          Battle Stats
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
          <div className="flex items-center">
            <Clock className="mr-1" size={14} />
            <span>Avg. Speed: {averageSpeed} cpm</span>
          </div>
          <div className="flex items-center">
            <Target className="mr-1" size={14} />
            <span>Total Passed: {players.reduce((acc, p) => acc + p.testsPassedCount, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}