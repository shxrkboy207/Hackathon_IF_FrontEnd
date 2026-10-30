// Rota: /avaliacao  (GET /equipes; cada botão abre /avaliacao/:id)
import Cartao from '../componentes/Cartao';
import Item from '../componentes/Item';
import Selo from '../componentes/Selo';
import EstadoDaRequisicao from '../componentes/EstadoDaRequisicao';
import useCarregar from '../hooks/useCarregar';
import { equipesServico } from '../servicos/equipesServico';

export default function TelaDeAvaliacao() {
  const { dados: equipes, carregando, erro, recarregar } = useCarregar(() => equipesServico.listar());

  function situacao(equipe) {
    if (!equipe.temProjeto) return 'Sem projeto enviado';
    return equipe.nota !== null ? 'Avaliada' : 'Pendente';
  }

  return (
    <Cartao className="fm">
      <h1>Avaliação</h1>
      <p className="sub" style={{ margin: '0 0 8px' }}>Escolha uma equipe para avaliar.</p>
      <EstadoDaRequisicao carregando={carregando} erro={erro} aoTentarNovamente={recarregar} />
      {equipes && equipes.length === 0 && <p className="sub">Nenhuma equipe inscrita ainda.</p>}
      {equipes && equipes.map((e) => (
        <Item key={e.id}>
          <div><b>{e.nome}</b><small>{situacao(e)}</small></div>
          {e.temProjeto && (
            <Selo ok to={`/avaliacao/${e.id}`}>{e.nota !== null ? 'Revisar' : 'Avaliar'}</Selo>
          )}
        </Item>
      ))}
    </Cartao>
  );
}
