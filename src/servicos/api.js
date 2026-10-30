// Único lugar do front que chama fetch(). As telas nunca falam com a rede direto:
// elas usam os serviços (equipesServico, avisosServico...), que usam este arquivo.

// Variáveis VITE_* ficam VISÍVEIS no navegador. Nunca coloque senhas ou chaves secretas nelas.
const URL_BASE = import.meta.env.VITE_API_URL ?? '/api';

// Sem resposta em 15 s a requisição é cancelada (evita a tela ficar "Carregando…" para sempre).
const TEMPO_LIMITE_MS = 15000;

// Erro padronizado: toda falha de rede ou resposta 4xx/5xx vira um ErroApi.
//  status   -> código HTTP (0 = servidor inalcançável ou tempo esgotado)
//  mensagem -> texto pronto para mostrar ao usuário
//  corpo    -> JSON devolvido pela API
export class ErroApi extends Error {
  constructor(status, mensagem, corpo = null) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.mensagem = mensagem;
    this.corpo = corpo;
  }
}

async function lerCorpo(resposta) {
  const texto = await resposta.text();
  if (!texto) return null; // ex.: 204 No Content
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

export async function requisicao(caminho, { metodo = 'GET', corpo } = {}) {
  const cabecalhos = { Accept: 'application/json' };
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json';

  // SEGURANÇA (fase futura): é aqui que entrará o cabeçalho Authorization com o token.
  // Como todas as chamadas passam por esta função, só este ponto precisará mudar.

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);

  let resposta;
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      signal: controlador.signal,
    });
  } catch (e) {
    const demorou = e?.name === 'AbortError';
    throw new ErroApi(
      0,
      demorou
        ? 'O servidor demorou demais para responder. Tente novamente.'
        : 'Não foi possível conectar ao servidor. Verifique se a API está no ar.'
    );
  } finally {
    clearTimeout(temporizador);
  }

  const dados = await lerCorpo(resposta);

  if (!resposta.ok) {
    const mensagem =
      (dados && (dados.mensagem ?? dados.message)) || `Erro ${resposta.status} ao falar com o servidor.`;
    throw new ErroApi(resposta.status, mensagem, dados);
  }
  return dados;
}

export const api = {
  get: (caminho) => requisicao(caminho),
  post: (caminho, corpo) => requisicao(caminho, { metodo: 'POST', corpo }),
  put: (caminho, corpo) => requisicao(caminho, { metodo: 'PUT', corpo }),
  delete: (caminho) => requisicao(caminho, { metodo: 'DELETE' }),
};
