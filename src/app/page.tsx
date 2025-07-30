
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Sword, Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleCreateBattle = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    router.push(`/battle/${newRoomId}?name=${encodeURIComponent(name)}`);
  };

  const handleJoinBattle = () => {
    if (roomId && name) {
      router.push(`/battle/${roomId}?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-70 rounded-xl p-8 max-w-md w-full shadow-2xl border border-purple-500">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sword className="text-yellow-400" size={32} />
            <h1 className="text-3xl font-bold text-white">Kode Kaisen</h1>
          </div>
          <p className="text-gray-300">
            Test your <s>jujutsu</s> coding skills in real-time battles against other <s>sorcerers</s> developers!
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleCreateBattle}
              disabled={!name}
              className={`w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all duration-200 ${
                name
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Zap className="mr-2" />
              Create New Battle
            </button>
          </div>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter room code"
            />
          </div>

          <div>
            <button
              onClick={handleJoinBattle}
              disabled={!name || !roomId}
              className={`w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all duration-200 ${
                name && roomId
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sword className="mr-2" size={18} />
              Join Existing Battle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}