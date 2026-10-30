import { api } from './api';

export const resultadoServico = {
  // GET /resultado -> { ranking: [{ posicao, id, nome, nota }], aguardando: [{ id, nome }] }
  buscar: () => api.get('/resultado'),
};
