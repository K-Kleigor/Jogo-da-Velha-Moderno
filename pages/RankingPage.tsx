import React from 'react';
import { useAppStore } from '../store';
import { Trophy, Trash2, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

const RankingPage: React.FC = () => {
  const { ranking, clearRanking } = useAppStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="text-yellow-500" size={32} />
          <h2 className="text-3xl font-black">HALL DA FAMA</h2>
        </div>
        
        {ranking.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Deseja realmente limpar o ranking?')) clearRanking();
            }}
            className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            title="Limpar Ranking"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden">
        {ranking.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg">Nenhum guerreiro registrado ainda...</p>
            <p className="text-sm">Jogue uma partida para inaugurar o ranking!</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-8 py-6 text-sm font-bold uppercase text-slate-500 tracking-widest">Posição</th>
                <th className="px-8 py-6 text-sm font-bold uppercase text-slate-500 tracking-widest">Guerreiro</th>
                <th className="px-8 py-6 text-sm font-bold uppercase text-slate-500 tracking-widest text-right">Vitórias</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((entry, idx) => (
                <motion.tr 
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-white/5 transition-colors"
                >
                  <td className="px-8 py-6 font-black italic text-xl flex items-center gap-3">
                    {idx === 0 && <Medal className="text-yellow-400" size={24} />}
                    {idx === 1 && <Medal className="text-slate-300" size={24} />}
                    {idx === 2 && <Medal className="text-amber-600" size={24} />}
                    <span className={idx < 3 ? 'text-2xl' : 'text-slate-500 ml-9'}>#{idx + 1}</span>
                  </td>
                  <td className="px-8 py-6 font-bold text-lg group-hover:translate-x-1 transition-transform">{entry.name}</td>
                  <td className="px-8 py-6 text-right font-black text-2xl text-blue-500">{entry.vitorias}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default RankingPage;