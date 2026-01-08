import React, { useState } from 'react';
import { useAppStore } from '../store';
import { motion } from 'framer-motion';
import { User, Swords } from 'lucide-react';

const PlayerSetup: React.FC = () => {
  const { setPlayers } = useAppStore();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (p1.trim() && p2.trim()) {
      setPlayers(p1.trim(), p2.trim());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto glass p-8 rounded-[2.5rem] shadow-2xl"
    >
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-blue-500/10 rounded-full text-blue-500 mb-4">
          <Swords size={32} />
        </div>
        <h2 className="text-3xl font-black italic">ARENA DE BATALHA</h2>
        <p className="text-slate-500">Defina os nomes dos combatentes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 ml-2 uppercase flex items-center gap-2">
            <User size={14} className="text-blue-500" /> Jogador X
          </label>
          <input
            required
            type="text"
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-medium"
            placeholder="Ex: Arqueiro Verde"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 ml-2 uppercase flex items-center gap-2">
            <User size={14} className="text-pink-500" /> Jogador O
          </label>
          <input
            required
            type="text"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-lg font-medium"
            placeholder="Ex: Rei de Copas"
          />
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          INICIAR PARTIDA
        </button>
      </form>
    </motion.div>
  );
};

export default PlayerSetup;