// Cartão do participante na tela inicial: avatar, estatísticas e barra de progresso.
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Cartao from './Cartao';

export default function CartaoPerfil({ perfil }) {
  return (
    <Cartao className="pf">
      <Avatar iniciais={perfil.iniciais} tamanho="g" />
      <b>{perfil.nome}</b>
      <small>{perfil.equipe}</small>

      <div className="st">
        <div><b>{perfil.concluidos}</b><small>concluídos</small></div>
        <div><b>{perfil.pendentes}</b><small>pendentes</small></div>
        <div><b>{perfil.pontos}</b><small>pontos</small></div>
      </div>

      <div className="pr"><span>Progresso da equipe</span><b>{perfil.progresso}%</b></div>
      <div className="bar"><i style={{ width: `${perfil.progresso}%` }} /></div>

      <Link to="/perfil" className="lk">Ver meu perfil</Link>
    </Cartao>
  );
}
