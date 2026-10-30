import { api } from './api';

export const avisosServico = {
  // GET /avisos -> [{ id, texto, urgente, criadoEm }]  (mais recentes primeiro)
  listar: () => api.get('/avisos'),

  // POST /avisos { texto, urgente } -> 201 { id, texto, urgente, criadoEm }
  publicar: (dados) => api.post('/avisos', dados),
};
