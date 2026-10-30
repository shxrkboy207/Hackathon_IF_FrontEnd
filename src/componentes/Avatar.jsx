// Círculo com as iniciais da pessoa. tamanho="g" = grande (perfil), padrão = pequeno (listas).
// aria-hidden: o nome já aparece em texto ao lado, então leitores de tela ignoram as iniciais.
export default function Avatar({ iniciais, tamanho }) {
  return (
    <span className={'avatar' + (tamanho === 'g' ? ' g' : '')} aria-hidden="true">
      {iniciais}
    </span>
  );
}
