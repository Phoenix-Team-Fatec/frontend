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
  //fiz sem login, pegar o user data
  const [userId, setUserId] = useState(3)
  

  const addCard = () => {
    setIsModalOpen(true);
  };

  // fazer na proxima sprint
  // const fetchLeadingProjetos = async() => {

  // }
  // const fetchParticipatingProjetos = async() => {

  // }
  // const fetchDeletedProjects = async() => {

  // }

  const fetchProjetos = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/relUserProj/getProjs/${userId}`)

      setProjects(data)
    } catch (error) {
      
    }
  }

  const handleProjectCreation = async (newProjectData: {title: string, responsibles: string, area: string, description: string}) => {
    
    const data = {
      proj_nome: newProjectData.title,
      proj_descricao: newProjectData.description,
      proj_area_atuacao: newProjectData.area,
      
    }

    try {

      const response =  await axios.post(`http://localhost:3000/projeto`, data)
      const projId = response.data.proj_id

      try {
        const relUserProj_data = {
          user_id: 3,
          proj_id: Number(projId),
          coordenador: true
        }
        const response_relUserProj = await axios.post(`http://localhost:3000/relUserProj`, relUserProj_data)
        console.log(response_relUserProj.data)
      } catch (error) {
        console.error('Erro ao criar relUserProj', error)
      }
    } catch (error) {
      console.error('Erro ao criar projeto', error)
    }

    fetchProjetos()
    setImageVisible(false);
  };

  const handleDelete = async (id: number) => {
    const response = await axios.put(`http://localhost:3000/projeto/delete/${id}`)
    fetchProjetos();
  };

  useEffect(()=>{
    fetchProjetos()
  }, [])

  useEffect(() => {
    if (projects.length > 0){
      setImageVisible(false)
    } else {
      setImageVisible(true)
    }
    console.log(projects)
  }, [projects])

  return (
    <div className="flex">
  <Sidebar />
  <div className="p-8 w-full">
    {imageVisible && (
      <div className="flex flex-col justify-center items-center min-h-[60vh] mb-8">
        <img
          src="/Organizing projects-rafiki.png"
          alt="Work Illustration"
          className="w-[220px] h-[220px] object-contain opacity-90"
        />
        <p className="text-gray-500 mt-4 text-lg font-light">
          Seus projetos aparecerão aqui
        </p>
      </div>
    )}

    {/* Container dos cards alinhado à direita com padding */}
    <div className="w-full pl-8">
      {/* Grid de cards responsivo com alinhamento à direita */}
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

    {/* Botão flutuante moderno */}
    <Button
      onClick={addCard}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#2D57AA] text-white flex items-center justify-center shadow-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300"
    >
      <Plus size={28} className="stroke-[3]" />
    </Button>

    <ProjectRegistration 
      open={isModalOpen} 
      setOpen={setIsModalOpen} 
      onProjectCreated={handleProjectCreation} 
    />
  </div>
</div>
  );
}
