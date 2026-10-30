// Ponto de entrada: liga o React ao <div id="root"> do index.html.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Todos os estilos do projeto estão em um único arquivo (separados por comentários).
import './estilos.css';

import LimiteDeErro from './componentes/LimiteDeErro';
import { AppProvider } from './contexto/AppContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* LimiteDeErro mostra uma mensagem amigável se algo quebrar */}
    <LimiteDeErro>
      {/* BrowserRouter habilita as rotas (URLs) */}
      <BrowserRouter>
        {/* AppProvider compartilha o toast e a equipe atual entre as telas */}
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </LimiteDeErro>
  </React.StrictMode>
);
