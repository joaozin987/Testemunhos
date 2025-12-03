import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";


// Componentes gerais
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LayoutPublico from "./components/LayoutPublico.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";

// Páginas públicas
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CadastroPage from "./pages/CadastroPage.jsx";
import MuseuPage from "./pages/MuseuPage.jsx";
import ExemplosPage from "./pages/ExemplosPage.jsx";
import SobrePage from "./pages/SobrePage.jsx";
import PerfilPage from "./pages/PerfilPage.jsx";
import RecuperarSenhaPage from "./pages/RecuperarSenhaPage.jsx";
import RedefinirPage from "./pages/RedefinirPage.jsx";

// Páginas do Admin
import AdminPage from "./pages/admin/AdminPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminPostsPage from "./pages/admin/AdminPostsPage.jsx";

// Rotas protegidas
import RotaProtegida from "./components/RotaProtegida.jsx";
import RotaAdmin from "./components/admin/RotaAdmin.jsx";

// Layout com Navbar e Footer
function AppLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* ✅ Grupo 1: Rotas Públicas (Login e Cadastro) */}
          <Route element={<LayoutPublico />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
          </Route>

          {/* ✅ Grupo 2: Rotas com Navbar/Footer */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/museu" element={<MuseuPage />} />
            <Route path="/exemplos" element={<ExemplosPage />} />
            <Route path="/sobre" element={<SobrePage />} />

            {/* ✅ Rotas Protegidas (usuário logado) */}
            <Route element={<RotaProtegida />}>
              <Route path="/perfil" element={<PerfilPage />} />
            </Route>
          </Route>

          {/* ✅ Grupo 3: Rotas de Administração */}
          <Route element={<RotaAdmin />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/usuarios" element={<AdminUsersPage />} />
              <Route path="/admin/posts" element={<AdminPostsPage />} />
            </Route>
          </Route>

          {/* ✅ Grupo 4: Telas sem Layout */}
          <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
          <Route path="/redefinir-senha" element={<RedefinirPage />} />

          {/* */}
             <Route element={<AppLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
