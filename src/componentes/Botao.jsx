// Botão largo do site. variante="alt" gera o botão de contorno (secundário).

export default function Botao({ variante, type = 'button', children, ...resto }) {
  const classe = 'btn' + (variante === 'alt' ? ' alt' : '');
  return (
    <button type={type} className={classe} {...resto}>
      {children}
    </button>
  );
}
