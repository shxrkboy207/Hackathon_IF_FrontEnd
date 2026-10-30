// Rota: /projeto
// Envia para POST /equipes/{id}/projeto. O id vem da equipe "atual" do contexto
// (definida no cadastro; futuramente virá do login).
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cartao from '../componentes/Cartao';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';
import Alerta from '../componentes/Alerta';
import { useApp } from '../contexto/AppContext';
import { equipesServico } from '../servicos/equipesServico';
import { validarUrlHttps } from '../utils/validar';

export default function TelaDeProjeto() {
  const navigate = useNavigate();
  const { equipeAtual, mostrarToast } = useApp();
  const [repo, setRepo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Sem equipe identificada, não há a quem associar o projeto.
  if (!equipeAtual) {
    return (
      <Cartao className="fm">
        <h1>Envio do projeto</h1>
        <Alerta>Cadastre sua equipe antes de enviar o projeto.</Alerta>
        <Botao onClick={() => navigate('/cadastro')}>Ir para o cadastro</Botao>
      </Cartao>
    );
  }

  async function enviar() {
    const link = repo.trim();
    // Só aceita https://: bloqueia javascript: e outros esquemas que seriam perigosos se o link fosse exibido depois.
    if (!validarUrlHttps(link)) { mostrarToast('Informe um link https:// válido para o repositório.'); return; }
    setEnviando(true);
    try {
      await equipesServico.enviarProjeto(equipeAtual.id, {
        repositorio: link,
        descricao: descricao.trim(),
      });
      mostrarToast('Projeto enviado.');
    } catch (e) {
      mostrarToast(e.mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Cartao className="fm">
      <h1>Envio do projeto</h1>
      <p className="sub" style={{ margin: 0 }}>{equipeAtual.nome}</p>
      <Campo id="repo" rotulo="Link do repositório" placeholder="https://github.com/equipe/projeto" maxLength={300} inputMode="url" autoComplete="off" value={repo} onChange={(e) => setRepo(e.target.value)} />
      <Campo id="desc" rotulo="Descrição curta" as="textarea" rows="3" placeholder="O que o projeto resolve?" maxLength={500} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      <Botao onClick={enviar} disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar projeto'}</Botao>
    </Cartao>
  );
}
