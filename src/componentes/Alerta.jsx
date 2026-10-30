// Faixa de mensagem dentro de uma tela.
// tipo: "erro" (padrão, vermelho) | "ok" (verde) | "info" (verde escuro)

export default function Alerta({ tipo = 'erro', children }) {
  const extra = tipo === 'ok' ? ' ok' : tipo === 'info' ? ' t' : '';
  return <div className={`note${extra}`}>{children}</div>;
}
