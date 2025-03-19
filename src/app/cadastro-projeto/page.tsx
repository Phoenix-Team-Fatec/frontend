"use client";

import { useState } from "react";
import ProjectRegistration from "@/components/ProjectRegistration/ProjectRegistration";

export default function CadastroProjeto() {
  // Estado para controlar a visibilidade do modal
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Renderiza o modal do cadastro de projetos */}
      <ProjectRegistration open={open} setOpen={setOpen} />
    </div>
  );
}
