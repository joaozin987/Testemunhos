import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';

// Nossos Componentes de Layout
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

// Nossas Páginas
import HomePage from "./pages/HomePages.jsx";
import LoginPage from "./pages/LoginPages.jsx";
import CadastroPage from "./pages/CadastroPages.jsx";
import MuseuPage from "./pages/MuseuPages.jsx";
import ExemplosPage from "./pages/ExemplosPages.jsx";
import SobrePage from "./pages/SobrePages.jsx";
import PerfilPage from "./pages/PerfilPages.jsx";
import RecuperarSenhaPage from "./pages/RecuperarSenhaPages.jsx";
import RedefinirPage from "./pages/RedefinirPages.jsx";
import RotaProtegida from "./components/RotaProtegida.jsx";

// --- COMPONENTE DE LAYOUT (A MOLDURA) ---
function AppLayout() {
  return (
    <>
      <Navbar />
      {/* O Outlet renderiza a página atual aqui dentro */}
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* GRUPO 1: ROTAS COM NAVBAR E FOOTER (dentro do AppLayout) */}
          <Route element={<AppLayout />}>
            
            {/* Rotas Públicas com Layout */}
            <Route path="/" element={<HomePage />} />
            <Route path="/museu" element={<MuseuPage />} />
            <Route path="/exemplos" element={<ExemplosPage />} />
            <Route path="/sobre" element={<SobrePage />} />

            {/* Rotas Protegidas com Layout */}
            <Route element={<RotaProtegida />}>
              <Route path="/perfil" element={<PerfilPage />} />
            </Route>

          </Route>

          {/* GRUPO 2: ROTAS SEM LAYOUT (TELA CHEIA) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
          {/* CORREÇÃO: A rota de redefinir senha precisa do :token */}
          <Route path="/redefinir-senha/:token" element={<RedefinirPage />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;