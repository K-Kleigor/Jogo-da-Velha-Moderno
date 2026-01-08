import React from 'react';
import { useAppStore } from '../store';
import { motion } from 'framer-motion';

const ScoreBoard: React.FC = () => {
  const { players, scores, currentPlayer, winner } = useAppStore();

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <motion.div 
        animate={currentPlayer === 'X' && !winner ? { scale: 1.05 } : { scale: 1 }}
        className={`glass p-4 rounded-3xl border-l-4 transition-all ${currentPlayer === 'X' && !winner ? 'border-l-blue-500 ring-2 ring-blue-500/20' : 'border-l-transparent'}`}
      >
        <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Jogador X</p>
        <p className="text-lg font-bold truncate">{players.X}</p>
        <p className="text-3xl font-black text-blue-500">{scores.X}</p>
      </motion.div>

      <div className="glass p-4 rounded-3xl flex flex-col items-center justify-center">
        <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Empates</p>
        <p className="text-3xl font-black text-slate-400">{scores.draws}</p>
      </div>

      <motion.div 
        animate={currentPlayer === 'O' && !winner ? { scale: 1.05 } : { scale: 1 }}
        className={`glass p-4 rounded-3xl border-r-4 text-right transition-all ${currentPlayer === 'O' && !winner ? 'border-r-pink-500 ring-2 ring-pink-500/20' : 'border-r-transparent'}`}
      >
        <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Jogador O</p>
        <p className="text-lg font-bold truncate">{players.O}</p>
        <p className="text-3xl font-black text-pink-500">{scores.O}</p>
      </motion.div>
    </div>
  );
};

export default ScoreBoard;