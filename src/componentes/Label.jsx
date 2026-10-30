// Rótulo de um campo de formulário. O estilo (negrito, tamanho, margens)
// vem da seção FORMULÁRIO de src/estilos.css. htmlFor liga o rótulo ao input de mesmo id.
export default function Label({ htmlFor, children, semMargemTopo = false }) {
  return (
    <label htmlFor={htmlFor} style={semMargemTopo ? { marginTop: 0 } : undefined}>
      {children}
    </label>
  );
}
