import { api } from './api';

// encodeURIComponent impede que um id vindo da URL do navegador (ex.: "../admin")
// altere o caminho da requisição.
const seg = (id) => encodeURIComponent(id);

export const equipesServico = {
  // GET /equipes -> [{ id, nome, temProjeto, nota }]
  listar: () => api.get('/equipes'),

  // GET /equipes/{id} -> { id, nome, temProjeto, nota }
  buscar: (id) => api.get(`/equipes/${seg(id)}`),

  // POST /equipes -> 201 { id, nome, codigo } | 409 (e-mail já inscrito)
  cadastrar: (dados) => api.post('/equipes', dados),

  // POST /equipes/{id}/projeto
  enviarProjeto: (id, dados) => api.post(`/equipes/${seg(id)}/projeto`, dados),

  // PUT /equipes/{id}/nota -> { id, nota }  (o servidor calcula a média)
  enviarNota: (id, notas) => api.put(`/equipes/${seg(id)}/nota`, notas),
};
