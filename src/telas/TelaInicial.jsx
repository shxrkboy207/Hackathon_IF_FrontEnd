// Rota: /inicio
import { Link } from 'react-router-dom';
import Cartao from '../componentes/Cartao';
import CartaoPerfil from '../componentes/CartaoPerfil';
import FluxoDecorativo from '../componentes/FluxoDecorativo';
import Item from '../componentes/Item';
import Selo from '../componentes/Selo';
import { atalhos, programacao, perfil, desafiosDoDia } from '../dados/dadosFicticios';

export default function TelaInicial() {
  return (
    <>
      {/* Faixa de destaque com a ilustração do fluxo */}
      <section className="hero">
        <FluxoDecorativo className="hero-fluxo" />
        <h1>1º Hackathon do IFPR Campus Pinhais</h1>
        <p>Forme sua equipe, enfrente os desafios e entregue sua solução. Aqui você acompanha tudo em um só lugar.</p>
        <span className="chip">IFPR · Campus Pinhais</span>
        <span className="chip">Data e local: a confirmar</span>
        <span className="chip">Check-in por QR Code</span>
      </section>

      {/* As cinco etapas do evento, numeradas e ligadas por uma linha (o "fluxo") */}
      <ol className="q" aria-label="Etapas do hackathon">
        {atalhos.map((a) => (
          <li key={a.to}>
            <Link to={a.to}>
              <b>{a.titulo}</b>
              <span>{a.detalhe}</span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Três colunas: programação, perfil e desafios */}
      <div className="g3">
        <Cartao>
          <h2>Programação</h2>
          {programacao.map((p) => (
            <Item key={p.titulo}>
              <span className="dt"><b>?</b><small>a definir</small></span>
              <div><b>{p.titulo}</b><small>{p.detalhe}</small></div>
            </Item>
          ))}
        </Cartao>

        <CartaoPerfil perfil={perfil} />

        <Cartao>
          <h2>Desafios do dia</h2>
          {desafiosDoDia.map((d) => (
            <Item key={d.titulo}>
              <div><b>{d.titulo}</b><small>{d.detalhe}</small></div>
              <Selo ok={d.concluido}>{d.concluido ? 'Concluído' : 'Pendente'}</Selo>
            </Item>
          ))}
        </Cartao>
      </div>
    </>
  );
}
