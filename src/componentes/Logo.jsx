// Logotipo "HackFlow". Com "to" vira link (barra superior); sem "to" é só texto (rodapé).
import { Link } from 'react-router-dom';

export default function Logo({ to }) {
  const conteudo = <>Hack<i>Flow</i></>;
  if (to) return <Link to={to} className="logo">{conteudo}</Link>;
  return <span className="logo">{conteudo}</span>;
}
