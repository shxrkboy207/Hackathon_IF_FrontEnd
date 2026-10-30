// Ilustração do "fluxo" do HackFlow: uma linha que liga quatro etapas (nós)
// e termina no ponto de chegada em coral. É desenhada uma única vez ao carregar a tela
// (animação em estilos.css, desativada para quem prefere menos movimento).
// aria-hidden: é só decoração, leitores de tela ignoram.
export default function FluxoDecorativo({ className = '' }) {
  return (
    <svg className={`fluxo ${className}`.trim()} viewBox="0 0 400 220" aria-hidden="true" focusable="false">
      {/* pathLength="1" normaliza o comprimento para 1, facilitando a animação do traço */}
      <path className="fluxo-linha" pathLength="1"
        d="M10 190 C 90 190, 90 60, 170 60 S 250 150, 320 110 S 370 30, 392 30" />
      <circle className="fluxo-no" cx="10" cy="190" r="7" />
      <circle className="fluxo-no" cx="170" cy="60" r="7" />
      <circle className="fluxo-no" cx="320" cy="110" r="7" />
      <circle className="fluxo-no fluxo-fim" cx="392" cy="30" r="7" />
    </svg>
  );
}
