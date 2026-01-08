import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../store';
import { Moon, Sun, Trophy, Gamepad2, PlayCircle } from 'lucide-react';

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useAppStore();

  const navItems = [
    { to: '/', label: 'Jogar', icon: <Gamepad2 size={18} /> },
    { to: '/ranking', label: 'Ranking', icon: <Trophy size={18} /> },
    { to: '/replay', label: 'Replay', icon: <PlayCircle size={18} /> },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-br from-blue-500 to-pink-500 p-2 rounded-lg">
          <Gamepad2 className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500 hidden sm:block">
          JOGO DA VELHA Pro
        </h1>
      </div>

      <nav className="flex items-center gap-1 sm:gap-4">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                isActive 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'hover:bg-white/10 text-slate-600 dark:text-slate-400'
              }`
            }
          >
            {item.icon}
            <span className="hidden xs:inline">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle Theme"
      >
        {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-600" />}
      </button>
    </header>
  );
};

export default Header;