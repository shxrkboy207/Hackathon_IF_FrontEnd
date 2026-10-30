import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Em desenvolvimento, tudo que o front chama em /api/... é repassado ao back end Java.
    // Assim o navegador acha que é a mesma origem (sem CORS).
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // porta do seu Spring/servidor Java
        changeOrigin: true,
        // Se o seu back end NÃO usa o prefixo /api nas rotas, descomente:
        // rewrite: (caminho) => caminho.replace(/^\/api/, ''),
      },
    },
  },
});
