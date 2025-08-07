import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Componentes
import RotaProtegida from "./components/RotaProtegida.jsx";

// Páginas Públicas
import LoginPages from "./pages/LoginPages.jsx";
import CadastroPages from "./pages/CadastroPages.jsx";
import RecuperarPages from "./pages/RecuperarSenhaPages.jsx"; 
import RedefinirPages from "./pages/RedefinirPages.jsx";

// Páginas Protegidas
// CORREÇÃO: A importação do HomePages estava quebrada. Agora está correta.
import HomePages from "./pages/HomePages.jsx";
import MuseuPages from "./pages/MuseuPages.jsx";
import ExemplosPages from "./pages/ExemplosPages.jsx";
import SobrePages from "./pages/SobrePages.jsx";
import PerfilPages from "./pages/PerfilPages.jsx";


function App() {
  return (
    <Router>
      <Routes>
        {/* --- Rotas Públicas --- */}
        <Route path="/login" element={<LoginPages />} />
        <Route path="/cadastro" element={<CadastroPages />} />
        <Route path="/recuperar-senha" element={<RecuperarPages />} />
        <Route path="/redefinir-senha/:token" element={<RedefinirPages />} />

        {/* --- Rotas Protegidas --- */} 
        <Route element={<RotaProtegida />}>
          <Route path="/" element={<HomePages />} />
          <Route path="/museu" element={<MuseuPages />} />
          <Route path="/exemplos" element={<ExemplosPages />} />
          <Route path="/sobre" element={<SobrePages />} />
          <Route path="/perfil" element={<PerfilPages />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;