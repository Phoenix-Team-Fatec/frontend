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
import { useUser } from "@/hook/UserData";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Dashboard() {
  const userDataHook = useUser()
  const router = useRouter();
  const userData = getUserData();
  const [authChecked, setAuthChecked] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [coordProjects, setCoordProjects] = useState<any[]>([]);
  const [notCoordProjects, setNotCoordProjects] = useState<any[]>([]);
  const [excludedProjects, setExcludedProjects] = useState<any[]>([]);  
  const [imageVisible, setImageVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(Number);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [areaFilter, setAreaFilter] = useState("all");
  const [areasAtuacao, setAreasAtuacao] = useState<any[]>([]);
  const [etapasPojeto, setEtapasProjeto] = useState<Record<number, any[]>>({})
  const [coordenaFilter, setCoordenaFilter] = useState<boolean | null>(null);

  const fetchAllEtapas = async (projects: any[]) => {
    const etProj: Record<number, any[]> = {}

    await Promise.all(
      projects.map(async (project) => {
        try {
          const { data } = await axios.get(`http://localhost:3000/etapas/${project.projeto_proj_id}`)

          etProj[project.projeto_proj_id] = data
        } catch (error) {
          console.error(`Erro ao buscar etapas para o projeto ${project.projeto_proj_id}`, error);
          etProj[project.projeto_proj_id] = [];
        }
      })
    )

    setEtapasProjeto(etProj)
  }

  const getProgress = (etapas: any[]): number => {
    let totalTarefas = 0
    let tarefasFeitas = 0
    
    try {
      etapas.forEach(etapa => {
        const tarefas = etapa.tarefas || []
    
        totalTarefas += tarefas.length
        tarefasFeitas += tarefas.filter((t: any) => t.tarefa_status === true).length
      })
    } catch (error) {
      return 0
    }
  
    if (totalTarefas === 0) return 0
  
    return Math.round((tarefasFeitas / totalTarefas) * 100)
  }

  useEffect(() => {
    if (!userData) {
      router.push('/sign-in');
    } else {
      setAuthChecked(true);
      setUserId(Number(userData.user_id))
    }
  }, [router]);

  const fetchAreasAtuacao = async () => {
    try {
      const response = await axios.get('http://localhost:3000/area_atuacao');
      setAreasAtuacao(response.data);
    } catch (error) {
      console.error("Erro ao buscar áreas de atuação", error);
      showNotification("Erro ao carregar áreas de atuação", false);
    }
  };

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
      
      const notExclProjs = projetos.filter(projeto =>
        projeto.projeto_proj_excluido == false
      )
      
      setProjects(notExclProjs);
      await fetchAllEtapas(notExclProjs)

      setCoordProjects(coordProjs);
      setNotCoordProjects(notCoordProjs);
      setExcludedProjects(exclProjs);
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

    // Filtro de coordenação
    if (coordenaFilter !== null) {
      result = result.filter(project => 
        coordenaFilter ? project.is_coordenador : !project.is_coordenador
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        project =>
          project.projeto_proj_nome.toLowerCase().includes(term) ||
          (project.projeto_proj_descricao && project.projeto_proj_descricao.toLowerCase().includes(term))
      );
    }

    // Filtro de status baseado no progresso
    if (statusFilter !== "all") {
      result = result.filter(project => {
        const progress = getProgress(etapasPojeto[project.projeto_proj_id] || []);
        
        if (statusFilter === "completed") {
          return progress === 100;
        } else if (statusFilter === "in-progress") {
          return progress > 0 && progress < 100;
        } else if (statusFilter === "not-started") {
          return progress === 0;
        }
        return true;
      });
    }

    if (areaFilter !== "all") {
      result = result.filter(project => project.area_atuacao_id === parseInt(areaFilter));
    }

    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter, areaFilter, coordenaFilter, etapasPojeto]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setAreaFilter("all");
    setCoordenaFilter(null);
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

  const handleProjectCreation = async (newProjectData: { title: string; responsibles: { email: string; user_id?: number }[]; selectedArea: number; description: string, startDate: string, endDate: string,partnerInstitutions:string[], fundingInstitutions:string[], projectValue:number  }) => {
    const data = {
      proj_nome: newProjectData.title,
      proj_descricao: newProjectData.description,
      area_atuacao_id: newProjectData.selectedArea,
      proj_data_inicio: newProjectData.startDate,
      proj_data_fim: newProjectData.endDate,
      proj_inst_financiadoras: newProjectData.fundingInstitutions,
      proj_inst_parceiras: newProjectData.partnerInstitutions,
      proj_valor_total: newProjectData.projectValue
    };

    try {
      const response = await axios.post(`http://localhost:3000/projeto`, data);
      const projId = response.data.proj_id;

      for (const user of newProjectData.responsibles) {
        const relUserProj_data = {
          user_id: user?.user_id,
          proj_id: Number(projId),
          coordenador: user.user_id === userDataHook.user_id,
          user_email: user.email,
        };
        await axios.post(`http://localhost:3000/relUserProj`, relUserProj_data);
      }

      showNotification("Projeto criado com sucesso!", true);
    } catch (error) {
      console.error("Erro ao criar relUserProj", error);
      showNotification("Erro ao associar usuário ao projeto", false);
    }

    fetchProjetos();
    setImageVisible(false);
  };

  const handleDelete = async (id: number) => {
    try {
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
      fetchAreasAtuacao();
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



      <div className={`w-full p-8 ${contentMargin} overflow-hidden`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Projetos</h2>
          
          <div className="flex flex-1 md:flex-none md:flex-row items-center gap-2 max-w-full md:max-w-[70%] flex-wrap">
            
            <div className="relative flex-1 md:w-[250px] min-w-[200px] mr-auto">
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

            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="h-9 p-1 px-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">Todas as Áreas</option>
              {areasAtuacao.map((area) => (
                <option key={area.area_atuacao_id} value={area.area_atuacao_id}>
                  {area.area_atuacao_nome}
                </option> 
              ))}
            </select>

            <div className="flex items-center gap-2">
              <label htmlFor="coordena-filter" className="text-sm text-gray-600 whitespace-nowrap">
                Coordena
              </label>
              <Switch
                id="coordena-filter"
                checked={coordenaFilter === true}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setCoordenaFilter(true);
                  } else if (coordenaFilter === true) {
                    setCoordenaFilter(false);
                  } else {
                    setCoordenaFilter(null);
                  }
                }}
                className="data-[state=checked]:bg-[#355EAF]"
              />
              <span className="text-sm text-gray-600">Não coordena</span>
            </div>

            <Button
              variant="outline"
              className="h-9 px-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 whitespace-nowrap"
              onClick={() => router.push('/dashboard/RecycleBin')}
            >
              <Trash2 size={18} className="mr-1" />
              Lixeira
            </Button>

            <Button
              variant="ghost"
              onClick={clearFilters}
              className={`h-9 px-2 text-sm whitespace-nowrap ${
                (searchTerm || statusFilter !== "all" || areaFilter !== "all" || coordenaFilter !== null) 
                  ? "text-gray-500" 
                  : "text-gray-300 cursor-default"
              }`}
              disabled={!(searchTerm || statusFilter !== "all" || areaFilter !== "all" || coordenaFilter !== null)}
            >
              Limpar
            </Button>
          </div>
        </div>

        <div className="pr-8">
          <hr className="border-t-2 border-[#C4D8FF] my-4" />
        </div>

        {(searchTerm || statusFilter !== "all" || areaFilter !== "all" || coordenaFilter !== null) && (
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
                        className="bg-white text-[#2D57AA] hover:text-blue-700 font-medium text-lg transition-colors duration-200"
                      >
                        {project.projeto_proj_nome}
                      </Link>
                    }
                    description={project.projeto_proj_descricao}
                    startDate={project.projeto_proj_data_inicio}
                    endDate={project.projeto_proj_data_fim || ""}
                    progress={getProgress(etapasPojeto[project.projeto_proj_id] || [])}
                    users={project.users || []}
                    onDelete={() => handleDelete(project.projeto_proj_id)}
                    fetchProjectData={fetchProjetos}
                    onNotify={showNotification}
                    className="relative bg-white rounded-xl shadow-md overflow-hidden 
                              transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/30 
                              hover:border-blue-200 hover:-translate-y-1 hover:scale-[1.0] border-2 border-gray-100"
                    proj_valor_total={project.projeto_proj_valor_total}
                    proj_inst_financiadoras={project.projeto_proj_inst_financiadoras}
                    proj_inst_parceiras={project.projeto_proj_inst_parceiras}
                    proj_area_atuacao_id={project.area_atuacao_id}
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