// Etiqueta arredondada ("Pendente", "Concluído", "Urgente", "Responsável").
// ok = verde | tom="neutro" = cinza | padrão = coral (alerta).
// Se receber "to", vira um link para outra rota.
import { Link } from 'react-router-dom';

export default function Selo({ ok = false, tom, to, children }) {
  const classe = 'pill' + (ok ? ' ok' : '') + (tom === 'neutro' ? ' neutro' : '');
  if (to) return <Link to={to} className={classe}>{children}</Link>;
  return <span className={classe}>{children}</span>;
}
