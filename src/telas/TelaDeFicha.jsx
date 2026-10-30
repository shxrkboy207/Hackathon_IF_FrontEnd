// Rota: /avaliacao/:id
// GET /equipes/{id} para o nome; PUT /equipes/{id}/nota para enviar as três notas.
// A média mostrada aqui é só uma prévia: quem calcula a nota final é o servidor.
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Cartao from '../componentes/Cartao';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';
import EstadoDaRequisicao from '../componentes/EstadoDaRequisicao';
import useCarregar from '../hooks/useCarregar';
import { useApp } from '../contexto/AppContext';
import { equipesServico } from '../servicos/equipesServico';
import { criterios } from '../dados/dadosFicticios';

export default function TelaDeFicha() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mostrarToast } = useApp();
  // O id vem da URL (controlado por quem digita): só números são aceitos.
  const idValido = /^\d+$/.test(id);
  const { dados: equipe, carregando, erro, recarregar } = useCarregar(
    () => (idValido ? equipesServico.buscar(id) : Promise.resolve(null)),
    [id]
  );

  const [notas, setNotas] = useState(['', '', '']); // uma nota (texto) por critério
  const [erroNota, setErroNota] = useState(false);
  const [enviando, setEnviando] = useState(false);

  if (!idValido || erro?.status === 404) return <Navigate to="/avaliacao" replace />; // id inválido ou inexistente
  if (carregando || erro) {
    return (
      <Cartao className="fm">
        <EstadoDaRequisicao carregando={carregando} erro={erro} aoTentarNovamente={recarregar} />
      </Cartao>
    );
  }

  // Converte para número; campo vazio vira NaN (que não passa na validação)
  const valores = notas.map((n) => (n === '' ? NaN : Number(n)));
  const valido = valores.every((v) => v >= 0 && v <= 10);
  const media = valido ? valores.reduce((a, b) => a + b) / valores.length : null;

  function mudarNota(posicao, texto) {
    setNotas(notas.map((n, i) => (i === posicao ? texto : n)));
    setErroNota(false);
  }

  async function enviar() {
    if (!valido) { setErroNota(true); return; }
    setEnviando(true);
    try {
      // Ex.: { inovacao: 8, execucaoTecnica: 7.5, apresentacao: 9 }
      const corpo = Object.fromEntries(criterios.map((c, i) => [c.campo, valores[i]]));
      await equipesServico.enviarNota(equipe.id, corpo);
      mostrarToast('Nota enviada.');
      navigate('/avaliacao');
    } catch (e) {
      mostrarToast(e.mensagem);
      setEnviando(false);
    }
  }

  return (
    <Cartao className="fm">
      <h1>{equipe.nome}</h1>
      <p className="sub" style={{ margin: 0 }}>Notas de 0 a 10</p>

      {criterios.map((c, i) => (
        <Campo key={c.id} id={c.id} rotulo={c.rotulo} type="number" min="0" max="10" step="0.5"
          value={notas[i]} onChange={(e) => mudarNota(i, e.target.value)} />
      ))}

      <p className="nota-final">Nota final <b>{media !== null ? media.toFixed(1) : '—'}</b></p>
      {erroNota && <div className="err" role="alert">Informe as três notas, entre 0 e 10.</div>}

      <Botao onClick={enviar} disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar nota'}</Botao>
      <Botao variante="alt" onClick={() => navigate('/avaliacao')}>Voltar à lista</Botao>
    </Cartao>
  );
}
