// Linha de lista com divisória (programação, desafios, avisos, ranking...).
// urgente = marca a linha com uma faixa coral à esquerda.
export default function Item({ urgente = false, children }) {
  return <div className={'it' + (urgente ? ' it-urgente' : '')}>{children}</div>;
}
