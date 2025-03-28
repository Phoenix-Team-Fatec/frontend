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

  const handleProjectCreation = async (newProjectData: {title: string, responsibles: string, area: string, description: string, endDate: string}) => {
    
    const data = {
      proj_nome: newProjectData.title,
      proj_descricao: newProjectData.description,
      proj_area_atuacao: newProjectData.area,
      proj_data_fim: newProjectData.endDate
    }

    try {

      const response =  await axios.post(`http://localhost:3000/projeto`, data)
      const projId = response.data.proj_id

      try {
        const relUserProj_data = {
          user_id: Number(newProjectData.responsibles),
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
                //trocar todos os atributos pelo novos (da requisição)
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
                onDelete={() => handleDelete(project.proj_id)}
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
