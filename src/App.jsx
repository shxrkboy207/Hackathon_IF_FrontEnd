// Mapa de rotas: cada URL abre uma tela (arquivo da pasta /telas).
// O antigo go('s-home') do HTML virou navigate('/inicio') (ou <Link to="/inicio">).
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './componentes/Layout';
import TelaDeLogin from './telas/TelaDeLogin';
import TelaInicial from './telas/TelaInicial';
import TelaDePainel from './telas/TelaDePainel';
import TelaDeCadastro from './telas/TelaDeCadastro';
import TelaDeDuplicidade from './telas/TelaDeDuplicidade';
import TelaDeConfirmacao from './telas/TelaDeConfirmacao';
import TelaDeProjeto from './telas/TelaDeProjeto';
import TelaDeAgenda from './telas/TelaDeAgenda';
import TelaDeAvaliacao from './telas/TelaDeAvaliacao';
import TelaDeFicha from './telas/TelaDeFicha';
import TelaDeResultado from './telas/TelaDeResultado';
import TelaDeRegulamento from './telas/TelaDeRegulamento';
import TelaDePerfil from './telas/TelaDePerfil';

export default function App() {
  return (
    <Routes>
      {/* Todas as telas ficam dentro do Layout (barra superior + rodapé + toast) */}
      <Route element={<Layout />}>
        {/* "/" redireciona para o login, como no protótipo (ele abria em s-login) */}
        <Route index element={<Navigate to="/login" replace />} />

        <Route path="login" element={<TelaDeLogin />} />
        <Route path="inicio" element={<TelaInicial />} />
        <Route path="painel" element={<TelaDePainel />} />
        <Route path="perfil" element={<TelaDePerfil />} />

        {/* Fluxo de inscrição: cadastro → (duplicado | confirmação) → projeto */}
        <Route path="cadastro" element={<TelaDeCadastro />} />
        <Route path="cadastro/duplicado" element={<TelaDeDuplicidade />} />
        <Route path="confirmacao" element={<TelaDeConfirmacao />} />
        <Route path="projeto" element={<TelaDeProjeto />} />

        <Route path="agenda" element={<TelaDeAgenda />} />

        {/* Avaliação: lista de equipes → ficha da equipe escolhida (:id) */}
        <Route path="avaliacao" element={<TelaDeAvaliacao />} />
        <Route path="avaliacao/:id" element={<TelaDeFicha />} />

        <Route path="resultado" element={<TelaDeResultado />} />
        <Route path="regulamento" element={<TelaDeRegulamento />} />

        {/* Qualquer URL desconhecida volta para o login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}
