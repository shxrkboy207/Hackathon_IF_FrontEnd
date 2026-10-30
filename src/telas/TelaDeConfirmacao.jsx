// Rota: /confirmacao  (recebe { nome, codigo } da TelaDeCadastro via location.state)
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Cartao from '../componentes/Cartao';
import Alerta from '../componentes/Alerta';
import Botao from '../componentes/Botao';

export default function TelaDeConfirmacao() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Se alguém abrir /confirmacao direto pela URL, não há dados: volta ao cadastro.
  if (!state) return <Navigate to="/cadastro" replace />;

  return (
    <Cartao className="fm">
      <h1>Inscrição confirmada</h1>
      <Alerta tipo="ok">
        <b>{state.nome}</b> está inscrita. Enviamos a confirmação para o seu e-mail.
      </Alerta>
      <div className="qr">QR code</div>
      <p style={{ textAlign: 'center', margin: 0 }}>Código da equipe: <b>{state.codigo}</b></p>
      <Botao onClick={() => navigate('/projeto')}>Enviar projeto</Botao>
      <Botao variante="alt" onClick={() => navigate('/agenda')}>Ver agenda e avisos</Botao>
    </Cartao>
  );
}
