// Rota: /perfil
// Layout: coluna lateral (dados + credencial) e conteúdo ao lado (desempenho, equipe, projeto
// e, só para o responsável, a gestão da equipe).
//
// Por enquanto os dados são de exemplo (contaExemplo). Com o back end, "conta" virá de GET /perfil.
// IMPORTANTE: esconder botões no front é só experiência de uso, NÃO é segurança.
// O servidor precisa conferir se quem chamou é mesmo o responsável antes de aceitar a ação.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alerta from '../componentes/Alerta';
import Avatar from '../componentes/Avatar';
import Botao from '../componentes/Botao';
import Cartao from '../componentes/Cartao';
import Item from '../componentes/Item';
import Selo from '../componentes/Selo';
import { useApp } from '../contexto/AppContext';
import { contaExemplo } from '../dados/dadosFicticios';
import { formatarDataHora, formatarHora, iniciaisDe } from '../utils/formatar';
import { validarUrlHttps } from '../utils/validar';

// Ações da seção de gestão (ainda sem back end: só mostram um aviso)
const acoesDeGestao = [
  { titulo: 'Editar dados da equipe', detalhe: 'Nome e informações de contato' },
  { titulo: 'Gerenciar integrantes', detalhe: 'Convidar ou remover participantes' },
  { titulo: 'Enviar ou atualizar projeto', detalhe: 'Repositório e descrição' },
];

export default function TelaDePerfil() {
  const navigate = useNavigate();
  const { mostrarToast } = useApp();

  const conta = contaExemplo;
  const { equipe, projeto, desempenho, credencial } = conta;

  // DEMONSTRAÇÃO: simula quem é o responsável para você ver as duas versões da tela.
  // Em produção não existe este estado: o servidor informa se a pessoa é responsável.
  const outroIntegrante = equipe.integrantes.find((i) => i.id !== conta.id);
  const [responsavelId, setResponsavelId] = useState(conta.id);

  const ehResponsavel = responsavelId === conta.id;
  const responsavel = equipe.integrantes.find((i) => i.id === responsavelId);
  const repositorioSeguro = projeto.enviado && validarUrlHttps(projeto.repositorio);

  function sair() {
    mostrarToast('Sessão encerrada.');
    navigate('/login');
  }

  return (
    <>
      {/* Alternador só para demonstração (sai quando houver login de verdade) */}
      <div className="demo" role="group" aria-label="Simulação do tipo de usuário (demonstração)">
        <span>Demonstração · ver o perfil como</span>
        <button type="button" aria-pressed={ehResponsavel} onClick={() => setResponsavelId(conta.id)}>
          Responsável
        </button>
        <button type="button" aria-pressed={!ehResponsavel} onClick={() => setResponsavelId(outroIntegrante.id)}>
          Integrante
        </button>
      </div>

      <div className="perfil">
        {/* ---------- Coluna lateral ---------- */}
        <aside className="perfil-lateral" aria-label="Dados do participante">
          <Cartao>
            <Avatar iniciais={iniciaisDe(conta.nome)} tamanho="g" />
            <h1>{conta.nome}</h1>
            <Selo ok={ehResponsavel} tom={ehResponsavel ? undefined : 'neutro'}>
              {ehResponsavel ? 'Responsável da equipe' : 'Integrante'}
            </Selo>

            <dl className="dados">
              <div><dt>E-mail</dt><dd>{conta.email}</dd></div>
              <div><dt>Turma</dt><dd>{conta.turma}</dd></div>
              <div><dt>Campus</dt><dd>{conta.campus}</dd></div>
              <div><dt>Celular</dt><dd>{conta.celularMascarado}</dd></div>
            </dl>
          </Cartao>

          <Cartao className="credencial">
            <h2>Credencial do evento</h2>
            <div className="qr" role="img" aria-label="QR code de check-in (exemplo)">QR code</div>
            <p className="codigo">{credencial.codigo}</p>
            <Selo ok={Boolean(credencial.checkinEm)} tom={credencial.checkinEm ? undefined : 'neutro'}>
              {credencial.checkinEm ? `Check-in às ${formatarHora(credencial.checkinEm)}` : 'Check-in pendente'}
            </Selo>
            <small style={{ marginTop: 10 }}>Apresente este QR code na entrada do evento.</small>
          </Cartao>

          <Botao variante="alt" onClick={sair} style={{ marginTop: 0 }}>Sair da conta</Botao>
        </aside>

        {/* ---------- Conteúdo ---------- */}
        <div className="perfil-conteudo">
          <div className="faixa tres">
            <Cartao className="kpi kpi-pontos"><b>{desempenho.pontos}</b><small>pontos da equipe</small></Cartao>
            <Cartao className="kpi"><b>{desempenho.posicao}º</b><small>de {desempenho.totalEquipes} equipes</small></Cartao>
            <Cartao className="kpi"><b>{desempenho.concluidos}/{desempenho.totalDesafios}</b><small>desafios concluídos</small></Cartao>
          </div>

          <Cartao>
            <div className="secao-topo">
              <h2>Equipe {equipe.nome}</h2>
              <small>{equipe.integrantes.length} de {equipe.maximo} integrantes</small>
            </div>
            {equipe.integrantes.map((i) => (
              <Item key={i.id}>
                <Avatar iniciais={iniciaisDe(i.nome)} />
                <div>
                  <b>{i.nome}{i.id === conta.id && ' (você)'}</b>
                  <small>{i.id === responsavelId ? 'Responsável pela equipe' : 'Integrante'}</small>
                </div>
                {i.id === responsavelId && <Selo ok>Responsável</Selo>}
              </Item>
            ))}
            <small style={{ marginTop: 10 }}>Código da equipe: <b>{equipe.codigo}</b></small>
            {!ehResponsavel && (
              <Alerta tipo="info">
                Só o responsável ({responsavel.nome}) pode editar a equipe e enviar o projeto.
              </Alerta>
            )}
          </Cartao>

          <Cartao>
            <div className="secao-topo">
              <h2>Projeto</h2>
              <Selo ok={projeto.enviado}>{projeto.enviado ? 'Enviado' : 'Pendente'}</Selo>
            </div>
            {projeto.enviado ? (
              <dl className="dados sem-topo">
                <div>
                  <dt>Repositório</dt>
                  <dd>
                    {/* Só vira link se for https (bloqueia javascript: e outros esquemas perigosos) */}
                    {repositorioSeguro ? (
                      <a href={projeto.repositorio} target="_blank" rel="noopener noreferrer">
                        {projeto.repositorio.replace(/^https:\/\//, '')}
                      </a>
                    ) : (
                      projeto.repositorio
                    )}
                  </dd>
                </div>
                <div><dt>Enviado em</dt><dd>{formatarDataHora(projeto.enviadoEm)}</dd></div>
                <div><dt>Situação</dt><dd>{projeto.status}</dd></div>
              </dl>
            ) : (
              <p className="sub" style={{ margin: 0 }}>
                Nenhum projeto enviado ainda.{' '}
                {ehResponsavel ? 'Use a gestão da equipe para enviar.' : 'Aguarde o responsável enviar.'}
              </p>
            )}
          </Cartao>

          {/* Seção separada: aparece só para o responsável */}
          {ehResponsavel && (
            <Cartao className="gestao">
              <div className="secao-topo">
                <h2>Gestão da equipe</h2>
                <Selo ok>Somente responsável</Selo>
              </div>
              <p className="sub" style={{ margin: '0 0 14px' }}>Ações disponíveis apenas para você, como responsável.</p>
              <div className="acoes">
                {acoesDeGestao.map((a) => (
                  <button
                    key={a.titulo}
                    type="button"
                    className="acao"
                    onClick={() => mostrarToast(`Demonstração: "${a.titulo}" ainda não está ligado ao servidor.`)}
                  >
                    <b>{a.titulo}</b>
                    <small>{a.detalhe}</small>
                  </button>
                ))}
              </div>
            </Cartao>
          )}
        </div>
      </div>
    </>
  );
}
