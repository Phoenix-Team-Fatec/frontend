import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import RegisterLogin from "./pages/AdminGUI/LoginRegister/RegisterLogin";
import ProjectRegistration from "../components/ProjectRegistration/ProjectRegistration"; // Importando o componente

const App: React.FC = () => {
  const [open, setOpen] = useState(true); // Estado para abrir/fechar o modal

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterLogin />} />

        {/* Rota para visualizar o componente ProjectRegistration */}
        <Route path="/cadastro-projeto" element={<ProjectRegistration open={open} setOpen={setOpen} />} />
      </Routes>
    </Router>
  );
};

export default App;
