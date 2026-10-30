import { api } from './api';

export const painelServico = {
  // GET /painel/resumo -> ver docs/CONTRATO_API.md
  resumo: () => api.get('/painel/resumo'),
};
