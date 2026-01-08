import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RefreshCw, Upload, Download, Maximize, Minimize } from 'lucide-react';
import { Move, PlayerMark } from '../types';
import Square from '../components/Square';

const ReplayPage: React.FC = () => {
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> to fix "Cannot find namespace 'NodeJS'" error in browser environments.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadLastGame = () => {
    const saved = localStorage.getItem('últimos-movimentos');
    if (saved) {
      setMoves(JSON.parse(saved));
      setCurrentMoveIndex(-1);
      setIsPlaying(false);
    } else {
      alert('Nenhuma partida anterior encontrada no armazenamento local.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json) && json.length > 0) {
          setMoves(json);
          setCurrentMoveIndex(-1);
          setIsPlaying(false);
        }
      } catch (err) {
        alert('Arquivo inválido!');
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (isPlaying) {
      if (currentMoveIndex < moves.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentMoveIndex(prev => prev + 1);
        }, 1000 / playbackSpeed);
      } else {
        setIsPlaying(false);
      }
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentMoveIndex, moves, playbackSpeed]);

  const currentBoard: PlayerMark[] = Array(9).fill(null);
  for (let i = 0; i <= currentMoveIndex; i++) {
    const move = moves[i];
    currentBoard[move.index] = move.player;
  }

  const togglePlay = () => setIsPlaying(!isPlaying);
  const resetReplay = () => {
    setCurrentMoveIndex(-1);
    setIsPlaying(false);
  };
  const stepForward = () => setCurrentMoveIndex(prev => Math.min(prev + 1, moves.length - 1));
  const stepBackward = () => setCurrentMoveIndex(prev => Math.max(prev - 1, -1));

  const progress = moves.length > 0 ? ((currentMoveIndex + 1) / moves.length) * 100 : 0;

  return (
    <div className={`space-y-8 ${isFullscreen ? 'fixed inset-0 z-[100] bg-slate-950 p-8 overflow-auto' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black flex items-center gap-3 italic">
            <RefreshCw className={isPlaying ? 'animate-spin' : ''} /> REPRODUTOR DE REPLAY
          </h2>
          <p className="text-slate-500">Reviva cada jogada épica com precisão cirúrgica.</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={loadLastGame} 
            className="flex items-center gap-2 px-4 py-3 glass hover:bg-white/10 rounded-xl text-sm font-bold transition-all"
          >
            <Download size={18} className="rotate-180" /> CARREGAR ÚLTIMA
          </button>
          
          <label className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-blue-500/20">
            <Upload size={18} /> UPLOAD JSON
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Board Display */}
        <div className={`mx-auto w-full max-w-md aspect-square glass rounded-[2.5rem] p-6 shadow-2xl relative ${isFullscreen ? 'max-w-2xl' : ''}`}>
          <div className="grid grid-cols-3 gap-4 h-full">
            {currentBoard.map((cell, idx) => (
              <Square 
                key={idx} 
                value={cell} 
                isWinning={false} 
                disabled={true} 
                onClick={() => {}} 
              />
            ))}
          </div>

          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-4 right-4 p-2 glass rounded-lg hover:bg-white/10 transition-all"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>

        {/* Controls */}
        <div className="glass p-8 rounded-[2.5rem] space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-bold text-slate-500 uppercase">
              <span>Progresso da Partida</span>
              <span>{currentMoveIndex + 1} / {moves.length} Jogadas</span>
            </div>
            
            <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-pink-500"
                animate={{ width: `${progress}%` }}
              />
              <input 
                type="range"
                min="-1"
                max={moves.length - 1}
                value={currentMoveIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentMoveIndex(parseInt(e.target.value));
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button onClick={stepBackward} className="p-4 glass rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-all">
              <SkipBack size={24} />
            </button>
            <button onClick={togglePlay} className="w-20 h-20 flex items-center justify-center bg-white text-slate-950 rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl">
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
            </button>
            <button onClick={stepForward} className="p-4 glass rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-all">
              <SkipForward size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Velocidade: {playbackSpeed}x</p>
              <input 
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <button 
              onClick={resetReplay}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-white/10 hover:bg-white/5 rounded-2xl font-bold transition-all"
            >
              <RefreshCw size={18} /> REINICIAR
            </button>
          </div>

          {moves.length > 0 && currentMoveIndex >= 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-white/5 rounded-2xl border border-white/10"
            >
              <p className="text-sm font-medium text-slate-400 text-center italic">
                Última jogada: <span className="font-bold text-white uppercase">{moves[currentMoveIndex].player}</span> na posição {moves[currentMoveIndex].index}
              </p>
            </motion.div>
          )}

          {moves.length === 0 && (
            <div className="text-center p-8 border-2 border-dashed border-white/10 rounded-[2rem] opacity-40">
              <Play className="mx-auto mb-4 text-slate-500" size={40} />
              <p className="font-bold">Nenhum replay carregado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplayPage;