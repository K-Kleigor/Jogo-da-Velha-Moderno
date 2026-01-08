// Importa a função create do Zustand (biblioteca de gerenciamento de estado simples e eficiente)
// e os tipos personalizados definidos no arquivo './types'
import { create } from 'zustand';
import { GameState, Move, PlayerMark, RankingEntry } from './types';

// Define a interface do estado global da aplicação, estendendo o GameState e adicionando funcionalidades extras
interface AppState extends GameState {
  isDarkMode: boolean;                  // Controla se o tema escuro está ativo
  toggleDarkMode: () => void;           // Função para alternar entre tema claro e escuro
  setPlayers: (x: string, o: string) => void; // Define os nomes dos jogadores (X e O)
  makeMove: (index: number) => void;    // Realiza uma jogada em uma posição do tabuleiro
  resetGame: () => void;                // Reinicia o jogo atual (limpa tabuleiro, vencedor, etc.)
  ranking: RankingEntry[];              // Lista do ranking dos jogadores (top 10)
  updateRanking: (winnerName: string) => void; // Atualiza o ranking ao final de uma partida vencida
  clearRanking: () => void;             // Limpa completamente o ranking salvo
}

// Tabuleiro inicial vazio: array de 9 posições preenchidas com null
const INITIAL_BOARD = Array(9).fill(null);

// Função auxiliar que verifica se há um vencedor ou empate no tabuleiro atual
const checkWinner = (board: PlayerMark[]) => {
  // Define todas as combinações vencedoras possíveis (linhas, colunas e diagonais)
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas horizontais
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas verticais
    [0, 4, 8], [2, 4, 6]             // diagonais
  ];

  // Percorre cada combinação vencedora
  for (const [a, b, c] of lines) {
    // Se as três posições estiverem preenchidas e forem iguais, há um vencedor
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] }; // Retorna o vencedor e a linha vencedora
    }
  }

  // Se todas as células estão preenchidas e ninguém venceu, é empate
  if (board.every(cell => cell !== null)) {
    return { winner: 'Draw' as const, line: null };
  }

  // Caso contrário, o jogo continua (não há vencedor ainda)
  return null;
};

// Criação da store global usando Zustand
export const useAppStore = create<AppState>((set, get) => ({
  // Estado inicial da aplicação
  isDarkMode: true, // Tema escuro ativado por padrão
  toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })), // Alterna o modo escuro/claro

  // Estado inicial do jogo
  board: INITIAL_BOARD,         // Tabuleiro vazio
  currentPlayer: 'X',           // Jogador X começa sempre
  winner: null,                 // Nenhum vencedor inicialmente
  winningLine: null,            // Nenhuma linha vencedora
  history: [],                  // Histórico de movimentos vazio
  isGameActive: false,          // Jogo só começa após definir nomes dos jogadores
  players: { X: '', O: '' },    // Nomes dos jogadores (vazios no início)
  scores: { X: 0, O: 0, draws: 0 }, // Placar de vitórias e empates
  ranking: JSON.parse(localStorage.getItem('jogo-da-velha-ranking') || '[]'), // Carrega ranking salvo

  // Define os nomes dos jogadores e inicia o jogo
  setPlayers: (x, o) => set({
    players: { X: x, O: o },
    isGameActive: true,
    board: INITIAL_BOARD,
    winner: null,
    winningLine: null,
    history: []
  }),

  // Função principal para realizar uma jogada
  makeMove: (index: number) => {
    const { board, currentPlayer, winner, history, players, isGameActive } = get();

    // Impede jogadas inválidas: jogo inativo, célula já ocupada ou já há vencedor
    if (!isGameActive || board[index] || winner) return;

    // Cria novo tabuleiro com a jogada atual
    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    // Registra o movimento no histórico
    const newMove: Move = { index, player: currentPlayer, timestamp: Date.now() };
    const newHistory = [...history, newMove];

    // Verifica se a jogada resultou em vitória ou empate
    const winResult = checkWinner(newBoard);

    if (winResult) {
      const { winner: gameWinner, line } = winResult;

      // Atualiza o estado com o resultado final (vitória ou empate)
      set(state => ({
        board: newBoard,
        winner: gameWinner,
        winningLine: line,
        history: newHistory,
        scores: {
          ...state.scores,
          X: gameWinner === 'X' ? state.scores.X + 1 : state.scores.X,
          O: gameWinner === 'O' ? state.scores.O + 1 : state.scores.O,
          draws: gameWinner === 'Draw' ? state.scores.draws + 1 : state.scores.draws,
        }
      }));

      // Se houve um vencedor (não empate), atualiza o ranking com o nome do jogador vencedor
      if (gameWinner !== 'Draw' && gameWinner !== null) {
        get().updateRanking(players[gameWinner]);
      }

      // Salva o histórico da partida atual no localStorage para possível recuperação futura
      localStorage.setItem('últimos-movimentos', JSON.stringify(newHistory));
    } else {
      // Se não houve vencedor, apenas troca o jogador atual e atualiza tabuleiro/histórico
      set({
        board: newBoard,
        currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
        history: newHistory
      });
    }
  },

  // Reinicia apenas o jogo atual (mantém placar, ranking e nomes dos jogadores)
  resetGame: () => set(state => ({
    board: INITIAL_BOARD,
    currentPlayer: 'X',
    winner: null,
    winningLine: null,
    history: []
  })),

  // Atualiza o ranking de jogadores após uma vitória
  updateRanking: (winnerName: string) => {
    // Carrega o ranking atual do localStorage
    const currentRanking: RankingEntry[] = JSON.parse(localStorage.getItem('jogo-da-velha-ranking') || '[]');

    // Procura se o jogador vencedor já está no ranking
    const existingPlayerIndex = currentRanking.findIndex(p => p.name === winnerName);

    if (existingPlayerIndex > -1) {
      // Se já existe, incrementa o número de vitórias
      currentRanking[existingPlayerIndex].vitorias += 1;
    } else {
      // Se não existe, adiciona como novo jogador com 1 vitória
      currentRanking.push({ name: winnerName, vitorias: 1 });
    }

    // Ordena por número de vitórias (decrescente) e mantém apenas os 10 primeiros
    const sortedRanking = currentRanking
      .sort((a, b) => b.vitorias - a.vitorias)
      .slice(0, 10);

    // Salva o ranking atualizado no localStorage e no estado da store
    localStorage.setItem('jogo-da-velha-ranking', JSON.stringify(sortedRanking));
    set({ ranking: sortedRanking });
  },

  // Limpa completamente o ranking (remove do localStorage e do estado)
  clearRanking: () => {
    localStorage.removeItem('jogo-da-velha-ranking');
    set({ ranking: [] });
  }
}));