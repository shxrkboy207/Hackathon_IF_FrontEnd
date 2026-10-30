// Moldura comum a todas as telas: Navbar no topo, tela atual no meio (<Outlet />),
// Rodape embaixo e Toast flutuando.
import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Rodape from './Rodape';
import Toast from './Toast';

export default function Layout() {
  const { pathname } = useLocation();
  const principal = useRef(null);
  const rotaAnterior = useRef(pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Acessibilidade: ao trocar de tela, leva o foco ao conteúdo (leitores de tela
    // anunciam a nova página). Na primeira carga não mexe no foco.
    if (rotaAnterior.current !== pathname) {
      rotaAnterior.current = pathname;
      principal.current?.focus({ preventScroll: true });
    }
  }, [pathname]);

  return (
    <>
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <Navbar />
      <main id="conteudo" ref={principal} tabIndex={-1}>
        <Outlet />
      </main>
      <Rodape />
      <Toast />
    </>
  );
}
