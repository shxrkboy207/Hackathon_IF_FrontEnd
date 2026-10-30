// Rota: /login
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cartao from '../componentes/Cartao';
import Campo from '../componentes/Campo';
import Label from '../componentes/Label';
import Botao from '../componentes/Botao';
import FluxoDecorativo from '../componentes/FluxoDecorativo';
import { useApp } from '../contexto/AppContext';

export default function TelaDeLogin() {
  const navigate = useNavigate();
  const { mostrarToast } = useApp();
  // Controla se a senha aparece como texto ("Mostrar") ou como bolinhas ("Ocultar")
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  function entrar(evento) {
    evento.preventDefault(); // evita recarregar a página ao enviar o formulário
    // SEGURANÇA (fase futura): aqui entrará a chamada de login (POST /auth/login),
    // guardar o token/sessão e só então navegar. Por enquanto não valida nada.
    navigate('/inicio');
  }

  return (
    <div className="login">
      <div className="login-marca">
        <p className="login-lema">Do cadastro ao ranking, em um só fluxo.</p>
        <p>Acompanhe sua equipe, envie o projeto e veja a avaliação do hackathon do IFPR Campus Pinhais.</p>
        <FluxoDecorativo />
      </div>

      <Cartao className="lgn">
        <h1>Entrar no HackFlow</h1>
        <p className="sub" style={{ margin: '0 0 6px' }}>Use o e-mail da sua inscrição.</p>

        <form onSubmit={entrar}>
          <Campo id="le" rotulo="E-mail" type="email" placeholder="voce@email.com" autoComplete="username" />

          <Label htmlFor="lp">Senha</Label>
          <div className="pw">
            <input id="lp" type={senhaVisivel ? 'text' : 'password'} autoComplete="current-password" />
            <button
              type="button"
              onClick={() => setSenhaVisivel(!senhaVisivel)}
              aria-pressed={senhaVisivel}
              aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {senhaVisivel ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <div className="ck">
            {/* "Manter conectado" (e não "lembrar senha"): a senha nunca deve ser guardada pelo site */}
            <label><input type="checkbox" defaultChecked /> Manter conectado</label>
            <button
              type="button"
              className="sublinhado"
              onClick={() => mostrarToast('Enviaríamos um link de recuperação por e-mail.')}
            >
              Esqueci minha senha
            </button>
          </div>

          <Botao type="submit" style={{ margin: 0 }}>Entrar</Botao>
        </form>

        <p className="sub rodape-login">
          Ainda não tem conta? <Link to="/cadastro" className="link-forte">Criar conta</Link>
        </p>
      </Cartao>
    </div>
  );
}
