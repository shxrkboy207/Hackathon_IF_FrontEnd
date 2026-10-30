// Mostra "Carregando…" ou a mensagem de erro com botão "Tentar novamente".
// Se não estiver carregando nem com erro, não desenha nada.
import Alerta from './Alerta';
import Botao from './Botao';

export default function EstadoDaRequisicao({ carregando, erro, aoTentarNovamente }) {
  if (carregando) return <p className="sub" role="status">Carregando…</p>;
  if (erro) {
    return (
      <>
        <Alerta>{erro.mensagem}</Alerta>
        <Botao variante="alt" onClick={aoTentarNovamente}>Tentar novamente</Botao>
      </>
    );
  }
  return null;
}
