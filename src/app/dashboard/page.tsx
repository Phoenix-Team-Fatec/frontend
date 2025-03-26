"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CardItem from "@/components/Cards_Projects/Cards_Projects";
import { Plus } from "lucide-react"; // Ícone de "+"
import Sidebar from "@/components/Sidebar/Sidebar";
import ProjectRegistration from "@/components/ProjectRegistration/ProjectRegistration";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]); // Array para armazenar os projetos com seus dados
  const [imageVisible, setImageVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal de cadastro

  const addCard = () => {
    setIsModalOpen(true); // Abre o modal de cadastro de projeto
  };

  const handleProjectCreation = (newProjectData: any) => {
    setProjects([...projects, newProjectData]); // Adiciona o novo projeto com dados ao array
    setImageVisible(false); // Quando o card for adicionado, esconder a imagem
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex flex-col items-center gap-4 w-full">
        {imageVisible && (
          <div className="flex flex-col justify-center items-center min-h-screen">
            <img
              src="/Organizing projects-rafiki.png"
              alt="Work Illustration"
              className="w-[170px] h-[170px] object-contain"
            />
            <p className="text-gray-500 text-sm mt-2">
              Seus projetos aparecerão aqui
            </p>
          </div>
        )}

        {/* Cards */}
        <div className="flex flex-wrap gap-2">
          {projects.map((project, index) => (
            <CardItem key={index} projectData={project} />
          ))}
        </div>

        {/* Botão flutuante no canto inferior esquerdo */}
        <Button
          onClick={addCard}
          className="fixed bottom-4 right-4 w-[70px] h-[70px] rounded-full bg-[#2D57AA] text-white flex items-center justify-center shadow-lg hover:bg-blue-700"
        >
          <Plus size={40} />
        </Button>

        {/* Modal para criação de projeto */}
        <ProjectRegistration open={isModalOpen} setOpen={setIsModalOpen} onProjectCreated={handleProjectCreation} />
      </div>
    </div>
  );
}
