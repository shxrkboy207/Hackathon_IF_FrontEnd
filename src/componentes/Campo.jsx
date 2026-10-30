// Campo completo = Label + input (ou select/textarea).
// Exemplos:
//   <Campo id="email" rotulo="E-mail" type="email" />
//   <Campo id="qtd" rotulo="Integrantes" as="select"><option>3</option></Campo>
//   <Campo id="msg" rotulo="Mensagem" as="textarea" rows="3" />
// Qualquer prop extra (value, onChange, placeholder...) vai direto para o elemento.
import Label from './Label';

export default function Campo({ id, rotulo, as: Elemento = 'input', semMargemTopo, children, ...resto }) {
  return (
    <>
      <Label htmlFor={id} semMargemTopo={semMargemTopo}>{rotulo}</Label>
      <Elemento id={id} {...resto}>{children}</Elemento>
    </>
  );
}
