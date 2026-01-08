import React from 'react';
import { motion } from 'framer-motion';
import { X, Circle } from 'lucide-react';
import { PlayerMark } from '../types';

interface SquareProps {
  value: PlayerMark;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinning, disabled }) => {
  return (
    <motion.button
      whileHover={!disabled && !value ? { scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
      whileTap={!disabled && !value ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || !!value}
      className={`
        aspect-square rounded-2xl flex items-center justify-center text-4xl sm:text-6xl transition-all duration-300
        ${isWinning 
          ? (value === 'X' ? 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)] text-white' : 'bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.6)] text-white')
          : 'glass border-white/10 dark:border-white/5 hover:border-white/20'
        }
      `}
    >
      {value && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={!isWinning ? (value === 'X' ? 'text-blue-500 neon-text-blue' : 'text-pink-500 neon-text-pink') : 'text-white'}
        >
          {value === 'X' ? <X size={48} strokeWidth={3} /> : <Circle size={48} strokeWidth={3} />}
        </motion.div>
      )}
    </motion.button>
  );
};

export default Square;