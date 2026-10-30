// Barra superior. Muda conforme a rota:
//  - em /login mostra só o logo e o link "Regulamento";
//  - nas demais mostra menu, busca e avatar (clicar no avatar abre /perfil, onde fica o "Sair").
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { perfil } from '../dados/dadosFicticios';

const itensDoMenu = [
  { to: '/inicio', texto: 'Início' },
  { to: '/painel', texto: 'Equipes' },
  { to: '/agenda', texto: 'Agenda' },
  { to: '/regulamento', texto: 'Regulamento' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  const naTelaDeLogin = pathname === '/login';
  const naTelaInicial = pathname === '/inicio';

  return (
    <header className={'nav' + (naTelaInicial ? ' nav-home' : '')}>
      <div className="in">
        <Logo to="/inicio" />

        {naTelaDeLogin ? (
          <Link to="/regulamento" className="logn">Regulamento</Link>
        ) : (
          <>
            <nav className="links" aria-label="Principal">
              {itensDoMenu.map((item) => (
                // NavLink marca automaticamente o link da página atual (classe "on")
                <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'on' : '')}>
                  {item.texto}
                </NavLink>
              ))}
            </nav>

            {/* Busca ainda não implementada: fica desativada para não parecer quebrada */}
            <label className="sr">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-5-5" />
              </svg>
              <input placeholder="Busca em breve" aria-label="Buscar (em breve)" disabled />
            </label>

            <NavLink to="/perfil" className={({ isActive }) => 'av' + (isActive ? ' on' : '')} aria-label="Meu perfil" title="Meu perfil">
              {perfil.iniciais}
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
