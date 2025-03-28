"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import ProjectRegistration from "@/components/ProjectRegistration/ProjectRegistration";
import Link from "next/link";
import Cards_Projects from "@/components/Cards_Projects/Cards_Projects";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [imageVisible, setImageVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addCard = () => {
    setIsModalOpen(true);
  };

  const handleProjectCreation = (newProjectData: any) => {
    setProjects([...projects, newProjectData]);
    setImageVisible(false);
  };

  const handleDelete = (id: number) => {
    setProjects(projects.filter((_, index) => index !== id));
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
            <div key={index} className="relative w-full">
              <Cards_Projects
                id={index}
                title={
                  <Link href="/tasks" className="text-blue-600 hover:underline">
                    {project.title}
                  </Link>
                }
                description={project.description}
                startDate={project.startDate}
                endDate={project.endDate}
                progress={project.progress}
                users={project.users}
                onDelete={() => handleDelete(index)}
                fetchProjectData={() => {}}
              />
            </div>
          ))}
        </div>

        {/* Botão flutuante no canto inferior direito */}
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
