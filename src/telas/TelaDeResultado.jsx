// Rota: /resultado  (GET /resultado -> o servidor já devolve o ranking ordenado)
import Cartao from '../componentes/Cartao';
import Item from '../componentes/Item';
import EstadoDaRequisicao from '../componentes/EstadoDaRequisicao';
import useCarregar from '../hooks/useCarregar';
import { resultadoServico } from '../servicos/resultadoServico';

export default function TelaDeResultado() {
  const { dados, carregando, erro, recarregar } = useCarregar(() => resultadoServico.buscar());

  return (
    <Cartao className="fm">
      <h1>Resultado</h1>
      <p className="sub" style={{ margin: '0 0 8px' }}>Ranking atualizado a cada nota enviada.</p>
      <EstadoDaRequisicao carregando={carregando} erro={erro} aoTentarNovamente={recarregar} />

      {dados && dados.ranking.length === 0 && dados.aguardando.length === 0 && (
        <p className="sub">Ainda não há equipes com projeto enviado.</p>
      )}
      {dados && dados.ranking.map((e) => (
        <Item key={e.id}>
          <span className={'pos' + (e.posicao === 1 ? ' pos-1' : '')}>{e.posicao}</span>
          <div><b>{e.nome}</b></div>
          <b className="nota">{e.nota.toFixed(1)}</b>
        </Item>
      ))}
      {dados && dados.aguardando.map((e) => (
        <Item key={e.id}>
          <span className="pos" />
          <div>{e.nome}</div>
          <small>Aguardando avaliação</small>
        </Item>
      ))}
    </Cartao>
  );
}
