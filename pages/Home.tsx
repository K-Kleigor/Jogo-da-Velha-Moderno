import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useAppStore } from '../store';
import { useSound } from '../hooks/useSound';
import Square from '../components/Square';
import ScoreBoard from '../components/ScoreBoard';
import PlayerSetup from '../components/PlayerSetup';
import { RotateCcw, Download, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home: React.FC = () => {
  const { 
    isGameActive, 
    board, 
    makeMove, 
    winner, 
    winningLine, 
    resetGame, 
    players, 
    history 
  } = useAppStore();
  
  const playSound = useSound();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (winner === 'Draw') playSound('draw');
    else if (winner) playSound('win');
  }, [winner, playSound]);

  const handleSquareClick = (idx: number) => {
    if (!board[idx] && !winner) {
      playSound('click');
      makeMove(idx);
    }
  };

  const downloadReplay = () => {
    if (history.length === 0) return;
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ultima-partida-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isGameActive) {
    return <PlayerSetup />;
  }

  return (
    <div className="relative">
      {winner && winner !== 'Draw' && (
        <Confetti 
          width={windowSize.width} 
          height={windowSize.height} 
          recycle={false} 
          numberOfPieces={400} 
        />
      )}

      <ScoreBoard />

      <motion.div 
        className="max-w-md mx-auto aspect-square grid grid-cols-3 gap-3 sm:gap-4 p-4 glass rounded-[2.5rem] shadow-2xl relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {board.map((cell, idx) => (
          <Square 
            key={idx} 
            value={cell} 
            isWinning={winningLine?.includes(idx) || false} 
            disabled={!!winner} 
            onClick={() => handleSquareClick(idx)} 
          />
        ))}

        <AnimatePresence>
          {winner && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 -bottom-24 flex flex-col items-center justify-center pointer-events-none"
            >
              <h2 className="text-4xl font-black italic tracking-tighter text-center">
                {winner === 'Draw' ? (
                  <span className="text-slate-400">EMPATOU! 🤝</span>
                ) : (
                  <span className={winner === 'X' ? 'text-blue-500 neon-text-blue' : 'text-pink-500 neon-text-pink'}>
                    {players[winner]} VENCEU! 👑
                  </span>
                )}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-28 flex flex-wrap justify-center gap-4">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10"
        >
          <RotateCcw size={20} /> NOVO JOGO
        </button>

        {winner && (
          <button
            onClick={downloadReplay}
            className="flex items-center gap-2 px-6 py-4 bg-green-500/80 hover:bg-green-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-500/20"
          >
            <Download size={20} /> BAIXAR REPLAY
          </button>
        )}
      </div>

      {history.length > 0 && !winner && (
        <div className="mt-12 max-w-md mx-auto glass p-6 rounded-3xl opacity-60">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-500">
            <History size={16} /> Histórico de Jogadas
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.map((move, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-white/5 rounded border border-white/5">
                {move.player}: pos {move.index}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;