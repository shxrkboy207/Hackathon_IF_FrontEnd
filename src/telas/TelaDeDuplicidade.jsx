// Rota: /cadastro/duplicado
// Propositalmente NÃO mostra o nome nem a data da outra inscrição: qualquer pessoa pode digitar
// um e-mail no cadastro, e revelar esses dados exporia informação de terceiros.
import { useNavigate } from 'react-router-dom';
import Cartao from '../componentes/Cartao';
import Alerta from '../componentes/Alerta';
import Botao from '../componentes/Botao';
import { useApp } from '../contexto/AppContext';

export default function TelaDeDuplicidade() {
  const navigate = useNavigate();
  const { mostrarToast } = useApp();

  return (
    <Cartao className="fm">
      <h1>Este e-mail já está inscrito</h1>
      <Alerta>
        Já existe uma inscrição com este e-mail. A nova inscrição não foi criada.
      </Alerta>
      <Botao onClick={() => mostrarToast('Abriria a edição da sua inscrição (exige login).')}>
        Editar inscrição existente
      </Botao>
      <Botao variante="alt" onClick={() => navigate('/cadastro')}>Corrigir meus dados</Botao>
    </Cartao>
  );
}
