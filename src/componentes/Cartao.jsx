// Caixa com fundo, borda e cantos arredondados. className adiciona variações (ex.: "fm", "kpi").

export default function Cartao({ className = '', children }) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}
