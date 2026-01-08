// Importações principais do React e roteamento
import React, { useEffect } from 'react'; // React core e hook useEffect para efeitos colaterais
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Roteamento com HashRouter (para SPAs sem servidor de roteamento)
import { useAppStore } from './store'; // Hook do Zustand (ou similar) para acessar o estado global da aplicação
import Header from './components/Header'; // Componente reutilizável para o cabeçalho da página
import Home from './pages/Home'; // Página principal (Home) do jogo
import RankingPage from './pages/RankingPage'; // Página de ranking/hall da fama
import ReplayPage from './pages/ReplayPage'; // Página de reprodução de replays de partidas

// Componente principal da aplicação (raiz da árvore de componentes)
const App: React.FC = () => {
  // Extrai o estado do modo escuro do store global
  const { isDarkMode } = useAppStore();

  // Efeito colateral para alternar entre modo claro e escuro no documento HTML
  useEffect(() => {
    if (isDarkMode) {
      // Adiciona a classe 'dark' ao elemento root para ativar estilos Tailwind dark mode
      document.documentElement.classList.add('dark');
    } else {
      // Remove a classe 'dark' para voltar ao modo claro
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]); // Dependência: reexecuta apenas quando isDarkMode muda

  return (
    // Wrapper do roteador HashRouter (usa # na URL para navegação client-side)
    <Router>
      {/* Container principal da aplicação com layout flexível */}
      <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
        {/* Cabeçalho fixo no topo da página */}
        <Header />
        
        {/* Seção principal com conteúdo das rotas */}
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          {/* Definição das rotas da aplicação */}
          <Routes>
            {/* Rota principal: redireciona para a página inicial */}
            <Route path="/" element={<Home />} />
            {/* Rota para visualização do ranking */}
            <Route path="/ranking" element={<RankingPage />} />
            {/* Rota para reprodução de replays */}
            <Route path="/replay" element={<ReplayPage />} />
            {/* Rota curinga: redireciona qualquer URL inválida para a home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Rodapé fixo no final da página */}
        <footer className="py-6 text-center text-sm text-slate-500">
          © 2026 Jogo da Velha Pro • Designed by HKV
        </footer>
      </div>
    </Router>
  );
};

// Exporta o componente App como padrão para ser usado no index.tsx ou similar
export default App;