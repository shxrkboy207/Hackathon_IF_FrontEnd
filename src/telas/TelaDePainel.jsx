// Rota: /painel  (GET /painel/resumo)
// Os números e os gráficos são desenhados a partir da resposta da API.
import Cartao from '../componentes/Cartao';
import GraficoBarras from '../componentes/GraficoBarras';
import GraficoRosca from '../componentes/GraficoRosca';
import GraficoLinha from '../componentes/GraficoLinha';
import EstadoDaRequisicao from '../componentes/EstadoDaRequisicao';
import useCarregar from '../hooks/useCarregar';
import { painelServico } from '../servicos/painelServico';
import { formatarDataHora } from '../utils/formatar';

export default function TelaDePainel() {
  const { dados, carregando, erro, recarregar } = useCarregar(() => painelServico.resumo());

  const kpis = dados && [
    { valor: dados.equipes, rotulo: 'Equipes participantes' },
    { valor: dados.desafiosConcluidos, rotulo: 'Desafios concluídos' },
    { valor: dados.desafiosPendentes, rotulo: 'Desafios pendentes' },
    { valor: `${dados.progressoGeral}%`, rotulo: 'Progresso geral' },
  ];

  return (
    <>
      <h1>Painel das equipes</h1>
      <p className="sub" style={{ margin: 0 }}>
        {dados ? `Atualizado em ${formatarDataHora(dados.atualizadoEm)}.` : ' '}
      </p>

      <EstadoDaRequisicao carregando={carregando} erro={erro} aoTentarNovamente={recarregar} />

      {dados && (
        <>
          {/* Quatro números de destaque */}
          <div className="faixa">
            {kpis.map((k) => (
              <Cartao key={k.rotulo} className="kpi">
                <b>{k.valor}</b>
                <small>{k.rotulo}</small>
              </Cartao>
            ))}
          </div>

          <div className="cg">
            <Cartao>
              <h2>Desafios concluídos por equipe</h2>
              <GraficoBarras dados={dados.desafiosPorEquipe} />
            </Cartao>

            <div className="rc">
              <Cartao>
                <h2>Situação dos desafios</h2>
                <GraficoRosca situacao={dados.situacao} />
              </Cartao>
              <Cartao>
                <h2>Evolução da equipe (pontos por dia)</h2>
                <GraficoLinha pontos={dados.pontosPorDia} />
              </Cartao>
            </div>
          </div>
        </>
      )}
    </>
  );
}
