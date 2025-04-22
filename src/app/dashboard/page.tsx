'use client'

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Plus, Search, Filter, X } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar/Sidebar";
import ProjectRegistration from "@/components/ProjectRegistration/ProjectRegistration";
import Popup from "@/components/Feedback/popup";
import SimpleAIChat from "@/components/SimpleAIChat/SimpleAIChat";
import ProjectCard from "@/components/Cards_Projects/Cards_Projects";

// Hooks e Utils
import { getUserData } from "@/utils/auth";
import { useUser } from "@/hook/UserData";

// Tipos
interface Project {
  projeto_proj_id: number;
  projeto_proj_nome: string;
  projeto_proj_descricao?: string;
  projeto_proj_status: number;
  projeto_proj_data_inicio: string;
  projeto_proj_data_fim?: string;
  projeto_proj_excluido: boolean;
  is_coordenador: boolean;
  users?: Array<{ user_id: number; user_nome: string }>;
}

type ProjectStatusFilter = "all" | "completed" | "in-progress" | "not-started";

export default function Dashboard() {
  const router = useRouter();
  const userDataHook = useUser();
  const userData = getUserData();

  // Estados de Autenticação
  const [authChecked, setAuthChecked] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Estados de Projetos
  const [projects, setProjects] = useState<Project[]>([]);
  const [coordProjects, setCoordProjects] = useState<Project[]>([]);
  const [notCoordProjects, setNotCoordProjects] = useState<Project[]>([]);
  const [excludedProjects, setExcludedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageVisible, setImageVisible] = useState(true);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("all");

  // Estados de Feedback
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  // Obter userId do usuário autenticado
  const userId = userData?.user_id ? Number(userData.user_id) : null;

  // Efeito para verificar autenticação
  useEffect(() => {
    if (!userData) {
      router.push('/sign-in');
    } else {
      setAuthChecked(true);
    }
  }, [router, userData]);

  // Efeito para carregar estado inicial do sidebar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSidebarState = localStorage.getItem('sidebarOpen');
      if (savedSidebarState !== null) {
        setSidebarOpen(savedSidebarState === 'true');
      }
      setInitialized(true);
    }
  }, []);

  // Efeito para carregar projetos quando inicializado e autenticado
  useEffect(() => {
    if (initialized && authChecked && userId) {
      fetchProjects();
    }
  }, [initialized, authChecked, userId]);

  // Mostrar notificação temporária
  const showNotification = useCallback((message: string, success: boolean) => {
    setPopupMessage(message);
    setIsSuccess(success);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  }, []);

  // Buscar projetos da API
  const fetchProjects = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data } = await axios.get<Project[]>(`http://localhost:3000/relUserProj/getProjs/${userId}`);
      
      // Classificar projetos
      const coordProjs = data.filter(projeto => 
        projeto.is_coordenador && !projeto.projeto_proj_excluido
      );
      
      const notCoordProjs = data.filter(projeto => 
        !projeto.is_coordenador && !projeto.projeto_proj_excluido
      );
      
      const exclProjs = data.filter(projeto => 
        projeto.projeto_proj_excluido
      );
      
      // Atualizar estados
      setProjects(data);
      setCoordProjects(coordProjs);
      setNotCoordProjects(notCoordProjs);
      setExcludedProjects(exclProjs);

    } catch (error) {
      console.error("Error fetching projects", error);
      showNotification("Erro ao carregar projetos", false);
    } finally {
      setLoading(false);
    }
  }, [userId, showNotification]);

  // Filtrar projetos com base nos critérios de busca e status
  const filteredProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];

    let result = [...projects];

    // Aplicar filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        project =>
          project.projeto_proj_nome.toLowerCase().includes(term) ||
          (project.projeto_proj_descricao && 
           project.projeto_proj_descricao.toLowerCase().includes(term))
      );
    }

    // Aplicar filtro de status
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "completed":
          result = result.filter(project => project.projeto_proj_status === 100);
          break;
        case "in-progress":
          result = result.filter(project => 
            (project.projeto_proj_status ?? 0) > 0 && 
            (project.projeto_proj_status ?? 0) < 100
          );
          break;
        case "not-started":
          result = result.filter(project => (project.projeto_proj_status ?? 0) === 0);
          break;
      }
    }

    return result;
  }, [projects, searchTerm, statusFilter]);

  // Limpar todos os filtros
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
  }, []);

  // Criar novo projeto
  const handleProjectCreation = useCallback(async (
    newProjectData: { 
      title: string; 
      responsibles: { email: string; user_id?: number }[]; 
      area: string; 
      description: string; 
      startDate: string; 
      endDate: string 
    }
  ) => {
    if (!userId) return;

    try {
      // Criar projeto principal
      const { data } = await axios.post<{ proj_id: number }>(`http://localhost:3000/projeto`, {
        proj_nome: newProjectData.title,
        proj_descricao: newProjectData.description,
        proj_area_atuacao: newProjectData.area,
        proj_data_inicio: newProjectData.startDate,
        proj_data_fim: newProjectData.endDate
      });

      // Associar usuários ao projeto
      await Promise.all(
        newProjectData.responsibles.map(user => 
          axios.post(`http://localhost:3000/relUserProj`, {
            user_id: userId,
            proj_id: data.proj_id,
            coordenador: user.user_id === userDataHook.user_id,
            user_email: user.email,
          })
        )
      );

      showNotification("Projeto criado com sucesso!", true);
      fetchProjects();
      setImageVisible(false);
    } catch (error) {
      console.error("Erro ao criar projeto", error);
      showNotification("Erro ao criar projeto", false);
    }
  }, [userId, userDataHook, showNotification, fetchProjects]);

  // Excluir projeto (marcar como excluído)
  const handleDelete = useCallback(async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/projeto/delete/${id}`);
      showNotification("Projeto excluído com sucesso!", true);
      fetchProjects();
    } catch (error) {
      console.error("Erro ao excluir projeto", error);
      showNotification("Erro ao excluir projeto", false);
    }
  }, [fetchProjects, showNotification]);

  // Atualizar visibilidade da imagem de placeholder
  useEffect(() => {
    setImageVisible(projects.length === 0);
  }, [projects]);

  // Loading state
  if (!authChecked || !initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
      </div>
    );
  }

  // Estilo dinâmico baseado no sidebar
  const contentMargin = sidebarOpen ? "ml-[250px]" : "ml-[80px]";

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Componente de Feedback */}
      <Popup
        isOpen={showPopup}
        message={popupMessage}
        isSuccess={isSuccess}
        onClose={() => setShowPopup(false)}
      />

      {/* Chat de IA */}
      <SimpleAIChat />

      {/* Conteúdo Principal */}
      <main className={`w-full p-8 ${contentMargin} overflow-hidden`}>
        {/* Cabeçalho e Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Projetos</h1>

          <div className="flex flex-1 md:flex-none md:flex-row items-center gap-2 max-w-full md:max-w-[70%]">
            {/* Campo de Busca */}
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

            {/* Filtro de Status */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatusFilter)}
                className="h-9 p-1 px-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="completed">Concluídos</option>
                <option value="in-progress">Em Progresso</option>
                <option value="not-started">Não Iniciados</option>
              </select>
            </div>

            {/* Botão Limpar Filtros (condicional) */}
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

        {/* Feedback de Filtros Aplicados */}
        {(searchTerm || statusFilter !== "all") && (
          <div className="mb-4 text-sm text-gray-500">
            {filteredProjects.length === 0 ? (
              <p>Nenhum projeto encontrado com os filtros aplicados.</p>
            ) : (
              <p>Mostrando {filteredProjects.length} de {projects.length} projetos</p>
            )}
          </div>
        )}

        {/* Conteúdo Principal Condicional */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <EmptyState 
            imageSrc="/Organizing projects-rafiki.svg"
            message="Seus projetos aparecerão aqui..."
            imageSize={350}
          />
        ) : filteredProjects.length === 0 ? (
          <EmptyState 
            imageSrc="/Organizing projects-rafiki.svg"
            message="Nenhum projeto corresponde aos filtros aplicados"
            imageSize={250}
            action={
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Limpar Filtros
              </Button>
            }
          />
        ) : (
          <ProjectGrid 
            projects={filteredProjects} 
            onDelete={handleDelete}
            fetchProjects={fetchProjects}
            showNotification={showNotification}
          />
        )}

        {/* Botão de Adicionar Projeto (Floating) */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#355EAF] text-white flex items-center justify-center shadow-xl hover:bg-[#2C4B8B] hover:scale-105 transition-all duration-300 cursor-pointer"
          aria-label="Adicionar novo projeto"
        >
          <Plus size={28} className="stroke-[3]" />
        </Button>

        {/* Modal de Criação de Projeto */}
        <ProjectRegistration 
          open={isModalOpen} 
          setOpen={setIsModalOpen} 
          onProjectCreated={handleProjectCreation} 
        />
      </main>
    </div>
  );
}

// Componente para estado vazio
function EmptyState({
  imageSrc,
  message,
  imageSize,
  action
}: {
  imageSrc: string;
  message: string;
  imageSize: number;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] w-full">
      <div className="flex flex-col items-center justify-center text-center">
        <img
          src={imageSrc}
          alt="Illustration"
          className={`w-[${imageSize}px] h-[${imageSize}px] object-contain opacity-90 mx-auto`}
        />
        <p className="text-gray-500 text-lg font-light mt-4">{message}</p>
        {action}
      </div>
    </div>
  );
}

// Componente para grid de projetos
function ProjectGrid({
  projects,
  onDelete,
  fetchProjects,
  showNotification
}: {
  projects: Project[];
  onDelete: (id: number) => void;
  fetchProjects: () => void;
  showNotification: (message: string, success: boolean) => void;
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 justify-items-start py-6">
        {projects.map((project) => (
          <div key={project.projeto_proj_id} className="w-full max-w-[220px]">
            <ProjectCard
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
              onDelete={() => onDelete(project.projeto_proj_id)}
              fetchProjectData={fetchProjects}
              onNotify={showNotification}
              className="hover:shadow-lg transition-shadow duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}