"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from 'axios';
import { getUserData } from "@/utils/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Trash2, Pen, Plus, X, Save } from "lucide-react";

// Componentes modularizados
import StageCard from "@/components/StageCard/StageCard";
import StageForm from "@/components/StageForm/StageForm";
import TaskForm from "@/components/TaskForm/TaskForm";
import TaskDetails from "@/components/TaskDetails/TaskDetails";

/**
 * Interface para representar uma Tarefa
 */
interface Tarefa {
  tarefa_id: number;
  tarefa_nome: string;
  tarefa_descricao: string;
  tarefa_data_inicio: string;
  tarefa_data_fim: string;
  tarefa_status: boolean;
}

/**
 * Interface para representar uma Subtarefa
 */
interface Subtarefa {
  subtarefa_id?: number;
  subtarefa_nome: string;
  subtarefa_concluida: boolean;
}

/**
 * Interface para representar uma Etapa
 */
interface Etapa {
  etapa_id: number;
  etapa_nome: string;
  etapa_descricao?: string;
  etapa_data_inicio?: string;
  etapa_data_fim?: string;
  etapa_status?: boolean;
  tarefas?: Tarefa[];
  usuarios?: any[];
  projId: number;
}

/**
 * Componente principal para gerenciar tarefas do projeto
 */
const ProjectTasks = () => {
  // Hooks para roteamento e parâmetros de URL
  const searchParams = useSearchParams();
  const proj_id = searchParams.get('projectId');
  const router = useRouter();

  // Estados para dados do projeto
  const [projectName, setProjectName] = useState("");
  const [stages, setStages] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Estados para formulários
  const initialStageState = {
    nome: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    status: true
  };

  const initialTaskState = {
    nome: "",
    descricao: "",
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tarefa_status: false
  };

  // Estados para gerenciamento de UI
  const [newStage, setNewStage] = useState(initialStageState);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [newTask, setNewTask] = useState(initialTaskState);
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<{ user_id: number; user_nome: string; user_email: string; user_foto: string; }[]>([]);
  const [selectedTask, setSelectedTask] = useState<Tarefa | null>(null);
  const [editableTask, setEditableTask] = useState<Tarefa | null>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtarefa[]>([]);
  const [responsaveis, setResponsaveis] = useState<string[]>([]);
  const [newSubtaskName, setNewSubtaskName] = useState("");
  const [newResponsavel, setNewResponsavel] = useState("");

  // Efeito para verificar autenticação
  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      router.push('/sign-in');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  // Efeito para buscar nome do projeto
  useEffect(() => {
    if (proj_id) {
      axios.get(`http://localhost:3000/projeto/getById/${proj_id}`)
        .then(response => {
          setProjectName(response.data.proj_nome);
        })
        .catch(error => {
          console.error("Erro ao buscar nome do projeto:", error);
        });
    }
  }, [proj_id]);

  // Efeito para buscar usuários do projeto
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:3000/relUserProj/getUsers/${Number(proj_id)}`)
        setAvailableUsers(response.data)
      } catch (error) {
        console.error("Erro ao buscar usuários do projeto", error)
      }
    }
    if (proj_id) fetchData()
  }, [proj_id])

  // Efeito para resetar formulário de etapa quando o modal fecha
  useEffect(() => {
    if (!isStageDialogOpen) {
      setNewStage(initialStageState);
    }
  }, [isStageDialogOpen]);

  // Efeito para resetar formulário de tarefa quando a etapa selecionada muda
  useEffect(() => {
    if (selectedStage === null) {
      setNewTask(initialTaskState);
    }
  }, [selectedStage]);

  // Efeito para carregar estado da sidebar do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSidebarState = localStorage.getItem('sidebarOpen');
      if (savedSidebarState !== null) {
        setSidebarOpen(savedSidebarState === 'true');
      }
      setInitialized(true);
    }
  }, []);

  // Efeito principal para buscar etapas do projeto
  useEffect(() => {
    if (!initialized || !authChecked || !proj_id) return;

    const fetchStages = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Etapa[]>(`http://localhost:3000/etapas/${Number(proj_id)}`);
        const etapasComTarefas = response.data.map(etapa => ({
          ...etapa,
          tarefas: etapa.tarefas || []
        }));
        setStages(etapasComTarefas);
      } catch (error) {
        console.error("Erro ao buscar etapas:", error);
        setStages([]);
        showNotification("Erro ao carregar etapas do projeto", false);
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, [proj_id, initialized, authChecked]);

  /**
   * Mostra notificação toast
   * @param message Mensagem a ser exibida
   * @param success Indica se é uma mensagem de sucesso ou erro
   */
  const showNotification = (message: string, success: boolean) => {
    if (success) {
      toast.success(message)
    } else {
      toast.error(message)
    }
  }

  /**
   * Cria uma nova etapa
   */
  const createStage = async () => {
    if (!newStage.nome.trim()) return;

    try {
      setLoading(true);
      const etapaData = {
        etapaNome: newStage.nome,
        etapaDescricao: newStage.descricao,
        etapaDataInicio: newStage.dataInicio
          ? new Date(newStage.dataInicio + 'T12:00:00').toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        etapaDataFim: newStage.dataFim
          ? new Date(newStage.dataFim + 'T12:00:00').toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        etapaStatus: newStage.status,
        projId: Number(proj_id)
      };

      const response = await axios.post(`http://localhost:3000/etapas`, etapaData);

      setStages(prev => [...prev, { ...response.data, tarefas: [] }]);
      setNewStage(initialStageState);
      setIsStageDialogOpen(false);
      showNotification("Etapa criada com sucesso!", true);
    } catch (error) {
      console.error("Erro ao criar etapa:", error);
      showNotification("Erro ao criar etapa. Verifique os dados e tente novamente.", false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exclui uma etapa
   * @param etapaId ID da etapa a ser excluída
   */
  const deleteStage = async (etapaId: number) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/etapas/${etapaId}`);
      
      setStages(prevStages => 
        prevStages.filter(stage => stage.etapa_id !== etapaId)
      );
      
      showNotification("Etapa excluída com sucesso!", true);
    } catch (error) {
      console.error("Erro ao excluir etapa:", error);
      showNotification("Erro ao excluir etapa. Tente novamente.", false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adiciona uma nova tarefa a uma etapa
   * @param etapaId ID da etapa que receberá a tarefa
   */
  const addTask = async (etapaId: number) => {
    if (!newTask.nome.trim()) return;

    try {
      setLoading(true);
      const taskData = {
        nome: newTask.nome,
        descricao: newTask.descricao,
        data_inicio: new Date(newTask.data_inicio + 'T12:00:00').toISOString().split('T')[0],
        data_fim: new Date(newTask.data_fim + 'T12:00:00').toISOString().split('T')[0],
        tarefa_status: newTask.tarefa_status,
        etapa_id: etapaId
      };

      const response = await axios.post(`http://localhost:3000/tarefa`, taskData);

      setStages(prevStages =>
        prevStages.map(stage =>
          stage.etapa_id === etapaId
            ? {
              ...stage,
              tarefas: [
                ...(stage.tarefas || []),
                response.data
              ]
            }
            : stage
        )
      );

      setNewTask(initialTaskState);
      setSelectedStage(null);
      showNotification("Tarefa adicionada com sucesso!", true);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      showNotification(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Erro ao criar tarefa"
          : "Erro desconhecido",
        false
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre os detalhes de uma tarefa
   * @param task Tarefa a ser exibida
   */
  const openTaskDetails = (task: Tarefa) => {
    setSelectedTask(task);
    setEditableTask({...task});
    setIsTaskDetailsOpen(true);
    setIsEditing(false);
    setSubtasks([]);
    setResponsaveis([]);
  };

  /**
   * Adiciona uma subtarefa
   */
  const addSubtask = () => {
    if (!newSubtaskName.trim()) return;
    
    const newSubtask: Subtarefa = {
      subtarefa_nome: newSubtaskName,
      subtarefa_concluida: false
    };
    
    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskName("");
  };

  /**
   * Remove uma subtarefa
   * @param index Índice da subtarefa a ser removida
   */
  const removeSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };

  /**
   * Alterna o estado de conclusão de uma subtarefa
   * @param index Índice da subtarefa
   */
  const toggleSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].subtarefa_concluida = !updatedSubtasks[index].subtarefa_concluida;
    setSubtasks(updatedSubtasks);
  };

  /**
   * Adiciona um responsável
   */
  const addResponsavel = () => {
    if (!newResponsavel.trim()) return;
    
    setResponsaveis([...responsaveis, newResponsavel]);
    setNewResponsavel("");
  };

  /**
   * Remove um responsável
   * @param index Índice do responsável a ser removido
   */
  const removeResponsavel = (index: number) => {
    const updatedResponsaveis = [...responsaveis];
    updatedResponsaveis.splice(index, 1);
    setResponsaveis(updatedResponsaveis);
  };

  /**
   * Salva alterações em uma tarefa
   */
  const saveTaskChanges = async () => {
    if (!editableTask) return;
    
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:3000/tarefa/${editableTask.tarefa_id}`, {
        nome: editableTask.tarefa_nome,
        descricao: editableTask.tarefa_descricao,
        data_inicio: editableTask.tarefa_data_inicio,
        data_fim: editableTask.tarefa_data_fim,
        tarefa_status: editableTask.tarefa_status,
      });

      setStages(prevStages =>
        prevStages.map(stage => ({
          ...stage,
          tarefas: stage.tarefas?.map(t => 
            t.tarefa_id === editableTask.tarefa_id ? response.data : t
          ) || []
        }))
      );

      setSelectedTask(response.data);
      setIsEditing(false);
      showNotification("Tarefa atualizada com sucesso!", true);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      showNotification("Erro ao atualizar tarefa. Tente novamente.", false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exclui uma tarefa
   * @param taskId ID da tarefa a ser excluída
   */
  const deleteTask = async (taskId: number) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/tarefa/${taskId}`);
      
      setStages(prevStages =>
        prevStages.map(stage => ({
          ...stage,
          tarefas: stage.tarefas?.filter(t => t.tarefa_id !== taskId) || []
        }))
      );
      
      setIsTaskDetailsOpen(false);
      showNotification("Tarefa excluída com sucesso!", true);
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      showNotification("Erro ao excluir tarefa. Tente novamente.", false);
    } finally {
      setLoading(false);
    }
  };

  // Se a autenticação ou inicialização não estiver concluída, mostra spinner
  if (!authChecked || !initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
      </div>
    );
  }

  // Ajusta a margem do conteúdo baseado no estado da sidebar
  const contentMargin = sidebarOpen ? "ml-[250px]" : "ml-[80px]";

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Container principal com responsividade */}
      <div className={`flex-1 ${contentMargin} transition-all duration-300 p-4 md:p-8 w-full overflow-x-auto`}>
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 break-words">
            Etapas do Projeto: {projectName}
          </h2>
          <Button
            onClick={() => setIsStageDialogOpen(true)}
            className="bg-[#355EAF] hover:bg-[#2d4f95] text-white w-full md:w-auto"
          >
            <Plus className="mr-2" size={16} />
            Criar Nova Etapa
          </Button>
        </div>
        
        <div className="mb-6">
          <hr className="border-t-2 border-[#C4D8FF]" />
        </div>

        {/* Conteúdo principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
          </div>
        ) : stages.length > 0 ? (
          // Container de etapas com scroll horizontal responsivo
          <div className="flex gap-4 pb-4 overflow-x-auto px-2 w-full">
            {stages.map((stage) => (
              <div key={stage.etapa_id} className="flex-shrink-0 w-72">
                <StageCard
                  stage={stage}
                  onAddTask={() => setSelectedStage(stage.etapa_id)}
                  onEditTask={(task) => {
                    openTaskDetails(task);
                    setIsEditing(true);
                  }}
                  onDeleteTask={(taskId) => {
                    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
                      deleteTask(taskId);
                    }
                  }}
                  onDeleteStage={(etapaId) => {
                    if (confirm("Tem certeza que deseja excluir esta etapa e todas suas tarefas?")) {
                      deleteStage(etapaId);
                    }
                  }}
                  onOpenTaskDetails={openTaskDetails}
                />
              </div>
            ))}
            {/* Espaço extra no final para garantir que a última etapa seja totalmente visível */}
            <div className="flex-shrink-0 w-4"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <p className="text-gray-500 text-lg font-light mb-6 text-center">Nenhuma etapa criada ainda...</p>
            <Button
              onClick={() => setIsStageDialogOpen(true)}
              className="bg-[#355EAF] hover:bg-[#2d4f95] text-white px-8 py-6 rounded-lg shadow-md"
            >
              <Plus className="mr-2" size={16} />
              Criar Primeira Etapa
            </Button>
          </div>
        )}

        {/* Modal para criação de nova etapa */}
        <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
          <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-[90vw] w-full max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">Criar Nova Etapa</DialogTitle>
            </DialogHeader>
            <StageForm
              stage={newStage}
              onChange={(field, value) => setNewStage({...newStage, [field]: value})}
              onSubmit={createStage}
              isSubmitting={loading}
            />
          </DialogContent>
        </Dialog>

        {/* Modal para adicionar nova tarefa */}
        {selectedStage && (
          <Dialog open={!!selectedStage} onOpenChange={() => setSelectedStage(null)}>
            <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-[90vw] w-full max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">Adicionar Nova Tarefa</DialogTitle>
              </DialogHeader>
              <TaskForm
                task={newTask}
                onChange={(field, value) => setNewTask({...newTask, [field]: value})}
                onSubmit={() => addTask(selectedStage)}
                isSubmitting={loading}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Modal para detalhes da tarefa */}
        <Dialog open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen}>
          <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-[90vw] w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {editableTask && (
              <>
                <DialogHeader className="mb-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    {isEditing ? (
                      <input
                        value={editableTask.tarefa_nome}
                        onChange={(e) => setEditableTask({
                          ...editableTask,
                          tarefa_nome: e.target.value
                        })}
                        className="text-2xl font-bold border rounded p-2 w-full"
                      />
                    ) : (
                      <DialogTitle className="text-2xl font-bold tracking-tight break-words">
                        {editableTask.tarefa_nome}
                      </DialogTitle>
                    )}
                    <div className="flex gap-2 w-full md:w-auto">
                      {!isEditing ? (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="w-full md:w-auto"
                        >
                          <Pen size={16} className="mr-2" />
                          Editar
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditing(false);
                              setEditableTask(selectedTask ? {...selectedTask} : null);
                            }}
                            className="w-full md:w-auto"
                          >
                            Cancelar
                          </Button>
                          <Button 
                            variant="default"
                            size="sm"
                            onClick={saveTaskChanges}
                            className="w-full md:w-auto"
                          >
                            <Save size={16} className="mr-2" />
                            Salvar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <DialogDescription className="text-gray-600">
                    Detalhes da tarefa
                  </DialogDescription>
                </DialogHeader>

                <TaskDetails
                  task={editableTask}
                  subtasks={subtasks}
                  responsaveis={responsaveis}
                  newSubtaskName={newSubtaskName}
                  newResponsavel={newResponsavel}
                  isEditing={isEditing}
                  onTaskChange={(field, value) => setEditableTask({
                    ...editableTask,
                    [field]: value
                  })}
                  onAddSubtask={addSubtask}
                  onRemoveSubtask={removeSubtask}
                  onToggleSubtask={toggleSubtask}
                  onSubtaskChange={(index, value) => {
                    const updated = [...subtasks];
                    updated[index].subtarefa_nome = value;
                    setSubtasks(updated);
                  }}
                  onAddResponsavel={addResponsavel}
                  onRemoveResponsavel={removeResponsavel}
                  onResponsavelChange={(index, value) => {
                    const updated = [...responsaveis];
                    updated[index] = value;
                    setResponsaveis(updated);
                  }}
                  onNewSubtaskChange={setNewSubtaskName}
                  onNewResponsavelChange={setNewResponsavel}
                  onSave={saveTaskChanges}
                  onCancel={() => {
                    setIsEditing(false);
                    setEditableTask(selectedTask ? {...selectedTask} : null);
                  }}
                  onEdit={() => setIsEditing(true)}
                />
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectTasks;