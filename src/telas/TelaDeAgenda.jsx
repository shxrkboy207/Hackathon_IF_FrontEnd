// Rota: /agenda  (mural de avisos + formulário da comissão)
// GET /avisos ao abrir; POST /avisos ao publicar.
import { useState } from 'react';
import Cartao from '../componentes/Cartao';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';
import Item from '../componentes/Item';
import Selo from '../componentes/Selo';
import EstadoDaRequisicao from '../componentes/EstadoDaRequisicao';
import useCarregar from '../hooks/useCarregar';
import { useApp } from '../contexto/AppContext';
import { avisosServico } from '../servicos/avisosServico';
import { formatarHora } from '../utils/formatar';

export default function TelaDeAgenda() {
  const { mostrarToast } = useApp();
  const { dados: avisos, definirDados, carregando, erro, recarregar } = useCarregar(() => avisosServico.listar());
  const [mensagem, setMensagem] = useState('');
  const [tipo, setTipo] = useState('i'); // "i" = informativo | "u" = urgente
  const [publicando, setPublicando] = useState(false);

  async function publicar() {
    const texto = mensagem.trim();
    if (!texto) { mostrarToast('Escreva a mensagem do aviso.'); return; }
    setPublicando(true);
    try {
      const novo = await avisosServico.publicar({ texto, urgente: tipo === 'u' });
      definirDados((anteriores) => [novo, ...(anteriores ?? [])]); // coloca no topo sem recarregar tudo
      setMensagem('');
      mostrarToast('Aviso publicado.');
    } catch (e) {
      mostrarToast(e.mensagem);
    } finally {
      setPublicando(false);
    }
  }

  return (
    <>
      <h1>Agenda e avisos</h1>
      <p className="sub" style={{ margin: '0 0 20px' }}>Mudanças de sala e horário aparecem aqui.</p>

      <div className="ag">
        <Cartao>
          <h2>Mural de avisos</h2>
          <EstadoDaRequisicao carregando={carregando} erro={erro} aoTentarNovamente={recarregar} />
          {avisos && avisos.length === 0 && <p className="sub">Nenhum aviso publicado ainda.</p>}
          {avisos && avisos.map((a) => (
            <Item key={a.id} urgente={a.urgente}>
              {/* O React já protege contra HTML malicioso; a função esc() do original não é mais necessária */}
              <div>{a.urgente && <><Selo>Urgente</Selo>{' '}</>}{a.texto}</div>
              <small>{formatarHora(a.criadoEm)}</small>
            </Item>
          ))}
        </Cartao>

        <Cartao>
          <h2>Publicar aviso (comissão)</h2>
          <Campo id="msg" rotulo="Mensagem" as="textarea" rows="3" semMargemTopo
            placeholder="Ex.: A apresentação da equipe Beta mudou para a sala B12." maxLength={280}
            value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
          <Campo id="tipo" rotulo="Tipo" as="select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="i">Informativo</option>
            <option value="u">Urgente</option>
          </Campo>
          <Botao onClick={publicar} disabled={publicando}>{publicando ? 'Publicando…' : 'Publicar aviso'}</Botao>
        </Cartao>
      </div>
    </>
  );
}
