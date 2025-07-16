import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Cotacoes from "./pages/Cotacoes";
import CotacaoDetalhes from "./pages/CotacaoDetalhes";
import NovaCotacao from "./pages/NovaCotacao";
import PrivateRoute from "./components/PrivateRoute";
import CadastrarUsuario from "./pages/cadastro";
import Usuarios from "./pages/usuarios";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas pelo PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cotacoes" element={<Cotacoes />} />
          <Route path="/cotacao/:cotacaoId" element={<CotacaoDetalhes />} />
          <Route path="/nova-cotacao" element={<NovaCotacao />} />
          <Route path="/cadastro" element={<CadastrarUsuario />} />
          <Route path="/users" element={<Usuarios />} />
        </Route>

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
