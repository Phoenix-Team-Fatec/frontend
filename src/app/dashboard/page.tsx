"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import ProjectRegistration from "@/components/ProjectRegistration/ProjectRegistration";
import Link from "next/link";
import Cards_Projects from "@/components/Cards_Projects/Cards_Projects";
import axios from "axios";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [imageVisible, setImageVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const addCard = () => {
    setIsModalOpen(true);
  };

  const fetchProjetos = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3000/relUserProj/getProjs/${userId}`);
      setProjects(data);
    } catch (error) {
      console.log("Error fetching projects", error);
    }finally {
      setLoading(false);
    }
  };

  const handleProjectCreation = async (newProjectData: { title: string; responsibles: string; area: string; description: string }) => {
    const data = {
      proj_nome: newProjectData.title,
      proj_descricao: newProjectData.description,
      proj_area_atuacao: newProjectData.area,
    };

    try {
      const response = await axios.post(`http://localhost:3000/projeto`, data);
      const projId = response.data.proj_id;

      try {
        const relUserProj_data = {
          user_id: 3,
          proj_id: Number(projId),
          coordenador: true,
        };
        const response_relUserProj = await axios.post(`http://localhost:3000/relUserProj`, relUserProj_data);
        console.log(response_relUserProj.data);
      } catch (error) {
        console.error("Erro ao criar relUserProj", error);
      }
    } catch (error) {
      console.error("Erro ao criar projeto", error);
    }

    fetchProjetos();
    setImageVisible(false);
  };

  const handleDelete = async (id: number) => {
    const response = await axios.put(`http://localhost:3000/projeto/delete/${id}`);
    fetchProjetos();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSidebarState = localStorage.getItem('sidebarOpen');
      if (savedSidebarState !== null) {
        setSidebarOpen(savedSidebarState === 'true');
      }
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      fetchProjetos();
    }
  }, [initialized]);

  useEffect(() => {
    if (projects.length > 0) {
      setImageVisible(false);
    } else {
      setImageVisible(true);
    }
  }, [projects]);

  if (!initialized) {
    return null; 
  }


  const contentMargin = sidebarOpen ? "ml-[250px]" : "ml-[80px]";

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`w-full p-8 ${contentMargin} overflow-hidden`}>
        <h2 className="text-2xl font-bold text-gray-800">Projetos</h2>
        <div className="pr-8">
          <hr className="border-t-2 border-[#C4D8FF] my-4" />
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
          </div>
        ) : imageVisible ? (
          <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] w-full">
            <div className="flex flex-col items-center justify-center text-center">
              <img
                src="/Organizing projects-rafiki.svg"
                alt="Work Illustration"
                className="w-[350px] h-[350px] object-contain opacity-90 mx-auto"
              />
              <p className="text-gray-500 text-lg font-light mt-4">Seus projetos aparecerão aqui...</p>
            </div>
          </div>
        ) : (
          <div className="w-full pl-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 justify-items-end">
              {projects.map((project, index) => (
                <div key={index} className="w-full max-w-[220px]">
                  <Cards_Projects
                    id={index}
                    projeto_proj_nome={
                      <Link
                        href={`/tasks?projectId=${project.projeto_proj_id}`}
                        className="text-[#2D57AA] hover:text-blue-700 font-medium text-lg transition-colors duration-200"
                      >
                        {project.projeto_proj_nome}
                      </Link>
                    }
                    description={project.projeto_proj_descricao}
                    startDate={project.projeto_proj_data_inicio}
                    progress={project.projeto_proj_status}
                    users={project.users}
                    onDelete={() => handleDelete(project.proj_id)}
                    fetchProjectData={() => {}}
                    className="hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
  
        <Button
          onClick={addCard}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#355EAF] text-white flex items-center justify-center shadow-xl hover:bg-[#2C4B8B] hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <Plus size={28} className="stroke-[3]" />
        </Button>
  
        <ProjectRegistration open={isModalOpen} setOpen={setIsModalOpen} onProjectCreated={handleProjectCreation} />
      </div>
    </div>
  );
}