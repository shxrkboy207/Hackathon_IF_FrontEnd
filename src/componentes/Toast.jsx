// Aviso rápido no pé da tela. A mensagem vem do contexto (mostrarToast).
// A região role="status" fica sempre na página; assim leitores de tela anunciam
// a mensagem quando ela aparece (uma região criada junto com o texto pode não ser lida).
import { useApp } from '../contexto/AppContext';

export default function Toast() {
  const { mensagemToast } = useApp();
  return (
    <div className="toast-area" role="status" aria-live="polite">
      {mensagemToast && <div className="toast">{mensagemToast}</div>}
    </div>
  );
}
