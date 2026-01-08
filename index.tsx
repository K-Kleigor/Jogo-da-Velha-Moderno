// Importa a biblioteca principal do React, necessária para usar JSX e componentes
import React from 'react';

// Importa a parte do React responsável por interagir com o DOM do navegador
// O 'client' indica que estamos usando a versão para renderização no lado do cliente
import ReactDOM from 'react-dom/client';

// Importa o componente principal da aplicação (geralmente contém rotas, layout e lógica global)
import App from './App';

/**
 * Busca o elemento HTML com id="root" no documento.
 * Esse elemento foi definido no index.html como <div id="root"></div>
 * É aqui que toda a aplicação React será renderizada.
 */
const rootElement = document.getElementById('root');

/**
 * Verificação de segurança: se o elemento #root não existir no HTML,
 * lança um erro claro para facilitar a depuração.
 * Isso evita falhas silenciosas caso o HTML esteja incorreto.
 */
if (!rootElement) {
  throw new Error("Não foi possível encontrar o elemento root no HTML.");
}

/**
 * Cria a "raiz" da aplicação React usando a API moderna do React 18.
 * Essa raiz permite renderização concorrente, suspenses e outras features avançadas.
 */
const root = ReactDOM.createRoot(rootElement);

/**
 * Renderiza a aplicação dentro do elemento #root.
 * 
 * <React.StrictMode>:
 *   - Ativa verificações e avisos extras em modo de desenvolvimento.
 *   - Ajuda a identificar problemas potenciais (efeitos colaterais, APIs obsoletas, etc.).
 *   - Não afeta a build de produção (é removido automaticamente).
 * 
 * <App />:
 *   - Componente raiz da aplicação, onde começa toda a estrutura de componentes,
 *     rotas, provedores de estado (como Zustand), tema, etc.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);