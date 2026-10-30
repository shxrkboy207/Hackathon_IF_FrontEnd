// Gráfico de rosca (donut). situacao = { concluidos, producaoDiaria, pendentes } (quantidades).
// Cada fatia é um círculo SVG: stroke-dasharray define o tamanho do arco
// e stroke-dashoffset (negativo) define onde ele começa, somando os arcos anteriores.
const RAIO = 56;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO; // ≈ 352

// As cores são variáveis do tema (definidas em estilos.css)
const FATIAS = [
  { chave: 'concluidos', cor: 'var(--gl)', texto: 'Concluídos' },
  { chave: 'producaoDiaria', cor: 'var(--g)', texto: 'Produção diária' },
  { chave: 'pendentes', cor: 'var(--elev)', texto: 'Pendentes' },
];

export default function GraficoRosca({ situacao }) {
  const total = FATIAS.reduce((soma, f) => soma + (situacao[f.chave] ?? 0), 0);

  let acumulado = 0;
  const itens = FATIAS.map((f) => {
    const fracao = total ? (situacao[f.chave] ?? 0) / total : 0;
    const arco = fracao * CIRCUNFERENCIA;
    const item = { ...f, percentual: Math.round(fracao * 100), arco, inicio: acumulado };
    acumulado += arco;
    return item;
  });

  return (
    <div className="dn">
      <svg width="150" height="150" viewBox="0 0 150 150" role="img" aria-label={`${itens[0].percentual}% concluídos`}>
        <g fill="none" strokeWidth="22" transform="rotate(-90 75 75)">
          {itens.map((i) => (
            <circle key={i.chave} cx="75" cy="75" r={RAIO} style={{ stroke: i.cor }}
              strokeDasharray={`${i.arco} ${CIRCUNFERENCIA}`} strokeDashoffset={-i.inicio} />
          ))}
        </g>
        <text className="rosca-valor" x="75" y="85" textAnchor="middle">{itens[0].percentual}%</text>
      </svg>
      <div className="lg">
        {itens.map((i) => (
          <div key={i.chave}><i style={{ background: i.cor }} />{i.texto} · {i.percentual}%</div>
        ))}
      </div>
    </div>
  );
}
