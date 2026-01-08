// Define o tipo que representa a marca de um jogador no tabuleiro:
// 'X' para o jogador X, 'O' para o jogador O, ou null para uma célula vazia
export type PlayerMark = 'X' | 'O' | null;

// Interface que representa um único movimento realizado no jogo
export interface Move {
  index: number;              // Posição no tabuleiro (0 a 8) onde o movimento foi feito
  player: 'X' | 'O';          // Qual jogador ('X' ou 'O') realizou o movimento
  timestamp: number;          // Momento exato do movimento em milissegundos (usado para histórico e possível replay)
}

// Interface auxiliar para representar um jogador no ranking (não usada diretamente no estado do jogo,
// mas útil para manipulações internas ou extensões futuras)
export interface Player {
  name: string;               // Nome do jogador
  wins: number;               // Número total de vitórias acumuladas
}

// Interface principal que define todo o estado relacionado ao jogo da velha em si
export interface GameState {
  board: PlayerMark[];        // Array de 9 posições representando o tabuleiro (null = vazio, 'X' ou 'O' = ocupado)
  currentPlayer: 'X' | 'O';   // Indica de quem é a vez de jogar no momento
  winner: PlayerMark | 'Draw'; // Armazena o vencedor da partida ('X', 'O', null se ainda não acabou, ou 'Draw' em caso de empate)
  winningLine: number[] | null; // Índices das 3 células que formam a linha vencedora (ex: [0,1,2]), ou null se não houver vencedor
  history: Move[];            // Histórico completo dos movimentos da partida atual (útil para replay ou undo futuro)
  isGameActive: boolean;      // Indica se o jogo está em andamento (true após definir nomes dos jogadores, false antes ou após fim da partida)
  players: {                  // Nomes personalizados dos jogadores
    X: string;                // Nome do jogador que usa a marca 'X'
    O: string;                // Nome do jogador que usa a marca 'O'
  };
  scores: {                   // Placar acumulado da sessão atual (não persiste entre recarregamentos)
    X: number;                // Quantidade de vitórias do jogador X
    O: number;                // Quantidade de vitórias do jogador O
    draws: number;            // Quantidade de empates
  };
}

// Interface que representa uma entrada no ranking de jogadores (persistido no localStorage)
export interface RankingEntry {
  name: string;               // Nome do jogador (exatamente como foi inserido no jogo)
  vitorias: number;           // Número total de vitórias acumuladas ao longo de várias partidas/sessões
}