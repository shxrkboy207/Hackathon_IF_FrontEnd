// Se uma tela quebrar por um erro inesperado, mostra esta mensagem em vez de uma tela em branco.
import { Component } from 'react';
import Botao from './Botao';

export default class LimiteDeErro extends Component {
  state = { temErro: false };

  static getDerivedStateFromError() {
    return { temErro: true };
  }

  componentDidCatch(erro) {
    console.error('Erro inesperado na interface:', erro);
  }

  render() {
    if (this.state.temErro) {
      return (
        <div className="erro-geral" role="alert">
          <h1>Algo deu errado</h1>
          <p className="sub">Ocorreu um erro inesperado. Volte ao início para tentar de novo.</p>
          <Botao onClick={() => window.location.assign('/')}>Voltar ao início</Botao>
        </div>
      );
    }
    return this.props.children;
  }
}
