'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar/Sidebar";
import ProjectRegistration from "@/components/ProjectRegistration/ProjectRegistration";
import Popup from "@/components/Feedback/popup";
import SimpleAIChat from "@/components/SimpleAIChat/SimpleAIChat";
import Link from "next/link";
import Cards_Projects from "@/components/Cards_Projects/Cards_Projects";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUserData } from "@/utils/auth";

export default function Dashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [coordProjects, setCoordProjects] = useState<any[]>([]);
  const [notCoordProjects, setNotCoordProjects] = useState<any[]>([]);
  const [excludedProjects, setExcludedProjects] = useState<any[]>([]);  
  const [imageVisible, setImageVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      router.push('/sign-in');
    } else {
      setAuthChecked(true);
      setUserId(Number(userData.user_id))
    }
  }, [router]);

  const addCard = () => {
    setIsModalOpen(true);
  };

  const fetchProjetos = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3000/relUserProj/getProjs/${userId}`);
      
      const projetos = Array.isArray(data) ? data : [];
    
      
      const coordProjs = projetos.filter(projeto => 
        projeto.is_coordenador === true && projeto.projeto_proj_excluido === false
      );
      
      const notCoordProjs = projetos.filter(projeto => 
        projeto.is_coordenador === false && projeto.projeto_proj_excluido === false
      );
      
      const exclProjs = projetos.filter(projeto => 
        projeto.projeto_proj_excluido === true
      );
      
      // Atualiza os estados
      setProjects(projetos);
      setCoordProjects(coordProjs);
      setNotCoordProjects(notCoordProjs);
      setExcludedProjects(exclProjs);

      console.log(coordProjects)
      console.log(notCoordProjects)
      console.log(excludedProjects)

      setProjects(data);
    } catch (error) {
      console.log("Error fetching projects", error);
      showNotification("Erro ao carregar projetos", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projects || projects.length === 0) {
      setFilteredProjects([]);
      return;
    }

    let result = [...projects];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        project => 
          project.projeto_proj_nome.toLowerCase().includes(term) || 
          (project.projeto_proj_descricao && project.projeto_proj_descricao.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== "all") {
      if (statusFilter === "completed") {
        result = result.filter(project => project.projeto_proj_status === 100);
      } else if (statusFilter === "in-progress") {
        result = result.filter(project => project.projeto_proj_status > 0 && project.projeto_proj_status < 100);
      } else if (statusFilter === "not-started") {
        result = result.filter(project => project.projeto_proj_status === 0);
      }
    }

    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (loading) {
      timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);

  const showNotification = (message: string, success: boolean) => {
    setPopupMessage(message);
    setIsSuccess(success);
    setShowPopup(true);
    
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleProjectCreation = async (newProjectData: { title: string; responsibles: string; area: string; description: string, startDate: string, endDate: string }) => {
    const data = {
      proj_nome: newProjectData.title,
      proj_descricao: newProjectData.description,
      proj_area_atuacao: newProjectData.area,
      proj_data_inicio: newProjectData.startDate,
      proj_data_fim: newProjectData.endDate
    };

    try {
      const response = await axios.post(`http://localhost:3000/projeto`, data);
      const projId = response.data.proj_id;

      try {
        const relUserProj_data = {
          user_id: userId,
          proj_id: Number(projId),
          coordenador: true,
        };
        const response_relUserProj = await axios.post(`http://localhost:3000/relUserProj`, relUserProj_data);
        console.log(response_relUserProj.data);
        
        showNotification("Projeto criado com sucesso!", true);
      } catch (error) {
        console.error("Erro ao criar relUserProj", error);
        showNotification("Erro ao associar usuário ao projeto", false);
      }
    } catch (error) {
      console.error("Erro ao criar projeto", error);
      showNotification("Erro ao criar projeto", false);
    }

    fetchProjetos();
    setImageVisible(false);
  };

  const handleDelete = async (id: number) => {
    try {
      //deixar put pois no backend apenas altera um campo
      const response = await axios.put(`http://localhost:3000/projeto/delete/${id}`);
      fetchProjetos();
      showNotification("Projeto excluído com sucesso!", true);
    } catch (error) {
      console.error("Erro ao excluir projeto", error);
      showNotification("Erro ao excluir projeto", false);
    }
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
    if (initialized && authChecked) {
      fetchProjetos();
    }
  }, [initialized, authChecked]);

  useEffect(() => {
    if (projects.length > 0) {
      setImageVisible(false);
    } else {
      setImageVisible(true);
    }
  }, [projects]);

  if (!authChecked || !initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
      </div>
    );
  }

  const contentMargin = sidebarOpen ? "ml-[250px]" : "ml-[80px]";

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <Popup 
        isOpen={showPopup}
        message={popupMessage}
        isSuccess={isSuccess}
        onClose={() => setShowPopup(false)}
      />
      
      <SimpleAIChat />
      
      <div className={`w-full p-8 ${contentMargin} overflow-hidden`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Projetos</h2>
          
          <div className="flex flex-1 md:flex-none md:flex-row items-center gap-2 max-w-full md:max-w-[70%]">
            <div className="relative flex-1 md:w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 w-full border-gray-300"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 p-1 px-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="completed">Concluídos</option>
                <option value="in-progress">Em Progresso</option>
                <option value="not-started">Não Iniciados</option>
              </select>
            </div>
            
            {(searchTerm || statusFilter !== "all") && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="h-9 px-2 text-gray-500 text-sm"
              >
                Limpar
              </Button>
            )}
          </div>
        </div>
        
        <div className="pr-8">
          <hr className="border-t-2 border-[#C4D8FF] my-4" />
        </div>

        {(searchTerm || statusFilter !== "all") && (
          <div className="mb-4 text-sm text-gray-500">
            {filteredProjects.length === 0 ? (
              <p>Nenhum projeto encontrado com os filtros aplicados.</p>
            ) : (
              <p>Mostrando {filteredProjects.length} de {projects.length} projetos</p>
            )}
          </div>
        )}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
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
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[calc(100vh-300px)] w-full">
            <div className="flex flex-col items-center justify-center text-center">
              <img
                src="/Organizing projects-rafiki.svg"
                alt="No Results"
                className="w-[250px] h-[250px] object-contain opacity-70 mx-auto"
              />
              <p className="text-gray-500 text-lg font-light mt-4">Nenhum projeto corresponde aos filtros aplicados</p>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="mt-4"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 justify-items-start py-6">
              {filteredProjects.map((project) => (
                <div key={project.projeto_proj_id} className="w-full max-w-[220px]">
                  <Cards_Projects
                    id={project.projeto_proj_id} 
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
                    endDate={project.projeto_proj_data_fim || ""}
                    progress={project.projeto_proj_status || 0}
                    users={project.users || []}
                    onDelete={() => handleDelete(project.projeto_proj_id)} 
                    fetchProjectData={fetchProjetos}
                    onNotify={showNotification}
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