// Conteúdo que ainda é fixo no front (não vem da API):
// textos da tela inicial, perfil de exemplo e critérios de avaliação.
// Equipes, avisos, ranking e painel agora vêm do back end (ver /servicos).

// ---------- Tela inicial ----------
export const atalhos = [
  { to: '/cadastro', titulo: 'Inscrição', detalhe: 'Entre com sua conta' },
  { to: '/painel', titulo: 'Equipes', detalhe: 'Monte ou entre em uma' },
  { to: '/projeto', titulo: 'Submissão', detalhe: 'Envie dentro do prazo' },
  { to: '/avaliacao', titulo: 'Avaliação', detalhe: 'Jurados e rubricas' },
  { to: '/resultado', titulo: 'Resultado', detalhe: 'Ranking e certificado' },
];

export const programacao = [
  { titulo: 'Abertura e credenciamento', detalhe: 'Check-in por QR Code' },
  { titulo: 'Prazo de submissão', detalhe: 'Validado pelo sistema' },
  { titulo: 'Apresentação e avaliação', detalhe: 'Jurados do Campus Pinhais' },
];

// Perfil de exemplo. Virá do login/usuário quando a parte de segurança existir.
export const perfil = {
  iniciais: 'MA',
  nome: 'Maria Alves',
  equipe: 'Equipe Pixel Hunters · IFPR Pinhais',
  concluidos: 12,
  pendentes: 7,
  pontos: 840,
  progresso: 62,
};

export const desafiosDoDia = [
  { titulo: 'Criar API de ranking', detalhe: 'Prazo hoje, 18h · 120 pts', concluido: false },
  { titulo: 'Protótipo da tela inicial', detalhe: 'Prazo hoje, 22h · 80 pts', concluido: false },
  { titulo: 'Configurar repositório', detalhe: 'Entregue ontem · 40 pts', concluido: true },
];

// ---------- Avaliação ----------
// "campo" é o nome da propriedade no JSON enviado para PUT /equipes/{id}/nota
export const criterios = [
  { id: 'c1', campo: 'inovacao', rotulo: 'Inovação' },
  { id: 'c2', campo: 'execucaoTecnica', rotulo: 'Execução técnica' },
  { id: 'c3', campo: 'apresentacao', rotulo: 'Apresentação' },
];

// ---------- Perfil ----------
// Usuário de exemplo (visual). Quando houver back end, este objeto virá de GET /perfil
// (ver docs/CONTRATO_API.md). Quem é o responsável da equipe é decidido pelo servidor.
export const contaExemplo = {
  id: 1,
  nome: 'Maria Alves',
  email: 'maria.alves@ifpr.edu.br',
  turma: 'BCC 2',
  campus: 'IFPR · Campus Pinhais',
  celularMascarado: '(41) •••••-0000', // o servidor nunca deve mandar o número completo sem necessidade
  credencial: { codigo: 'HF-482-MA', checkinEm: null }, // checkinEm: ISO-8601 quando o check-in for feito
  equipe: {
    nome: 'Pixel Hunters',
    codigo: 'HF-482',
    maximo: 5,
    integrantes: [
      { id: 1, nome: 'Maria Alves' },
      { id: 2, nome: 'João Pereira' },
      { id: 3, nome: 'Ana Souza' },
      { id: 4, nome: 'Pedro Lima' },
    ],
  },
  projeto: {
    enviado: true,
    repositorio: 'https://github.com/pixel-hunters/hackflow-app',
    enviadoEm: '2026-10-22T18:40:00',
    status: 'Recebido pela comissão',
  },
  desempenho: { pontos: 840, posicao: 2, totalEquipes: 7, concluidos: 12, totalDesafios: 19 },
};
