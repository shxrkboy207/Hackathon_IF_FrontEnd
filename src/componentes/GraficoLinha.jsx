// Gráfico de área/linha. pontos = [{ dia: "Seg", pontos: 120 }, ...].
// Cálculo das posições no SVG:
//  - eixo X: do x=60 ao x=390, dividido igualmente entre os pontos;
//  - eixo Y: y=150 é o zero e y=20 é o topo da escala (múltiplo de 300 que cabe o maior valor).
// As cores e fontes vêm das classes gl-* em estilos.css.
const X_INICIO = 60;
const X_FIM = 390;
const Y_ZERO = 150;
const ALTURA = 130;

export default function GraficoLinha({ pontos }) {
  if (!pontos.length) return <p className="sub">Sem dados ainda.</p>;

  const maximo = Math.max(...pontos.map((p) => p.pontos), 0);
  const topo = Math.max(300, Math.ceil(maximo / 300) * 300);
  const passo = pontos.length > 1 ? (X_FIM - X_INICIO) / (pontos.length - 1) : 0;

  const x = (i) => Math.round(X_INICIO + i * passo);
  const y = (valor) => Math.round(Y_ZERO - (valor / topo) * ALTURA);

  const linha = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(p.pontos)}`).join('');
  const area = `${linha}V${Y_ZERO}H${x(0)}Z`;
  const indiceDoPico = pontos.findIndex((p) => p.pontos === maximo);

  return (
    <svg className="grafico-linha" viewBox="0 0 420 190" width="100%" role="img" aria-label="Pontos por dia">
      {/* Linhas de grade e valores do eixo Y: 0, 1/3, 2/3 e topo da escala */}
      {[0, 1, 2, 3].map((n) => {
        const valor = (topo * n) / 3;
        return (
          <g key={n}>
            <path className="gl-grade" d={`M40 ${y(valor)}H410`} />
            <text className="gl-eixo" x="32" y={y(valor) + 4} textAnchor="end">{valor}</text>
          </g>
        );
      })}

      <path className="gl-area" d={area} />
      <path className="gl-linha" d={linha} />
      {pontos.map((p, i) => <circle className="gl-ponto" key={p.dia} cx={x(i)} cy={y(p.pontos)} r="4" />)}

      {/* Valor do pico */}
      <text className="gl-pico" x={x(indiceDoPico)} y={y(maximo) - 12} textAnchor="middle">{maximo}</text>

      {/* Dias da semana */}
      {pontos.map((p, i) => <text className="gl-eixo" key={p.dia} x={x(i)} y="172" textAnchor="middle">{p.dia}</text>)}
    </svg>
  );
}
