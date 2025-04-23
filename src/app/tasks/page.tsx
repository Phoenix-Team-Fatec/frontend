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

// Interfaces (pode mover para um arquivo separado types.ts se preferir)
interface Tarefa {
  tarefa_id: number;
  tarefa_nome: string;
  tarefa_descricao: string;
  tarefa_data_inicio: string;
  tarefa_data_fim: string;
  tarefa_status: boolean;
}

interface Subtarefa {
  subtarefa_id?: number;
  subtarefa_nome: string;
  subtarefa_concluida: boolean;
}

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

const ProjectTasks = () => {
  const searchParams = useSearchParams();
  const proj_id = searchParams.get('projectId');
  const [stages, setStages] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

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

  const [newStage, setNewStage] = useState(initialStageState);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [newTask, setNewTask] = useState(initialTaskState);
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [responsibles, setResponsibles] = useState<
    { email: string; user_id?: number }[]
  >([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    { user_id: number; user_nome: string; user_email: string; user_foto: string; }[]
  >([]);
  const [responsibleInput, setResponsibleInput] = useState("");
  const router = useRouter();

  // Estados para o modal de detalhes da tarefa
  const [selectedTask, setSelectedTask] = useState<Tarefa | null>(null);
  const [editableTask, setEditableTask] = useState<Tarefa | null>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtarefa[]>([]);
  const [availableUsers, setAvailableUsers] = useState<
    { user_id: number; user_nome: string; user_email: string; user_foto: string; }[]
  >([]);
  const [newSubtaskName, setNewSubtaskName] = useState("");
  const [newResponsavel, setNewResponsavel] = useState("");

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      router.push('/sign-in');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:3000/relUserProj/getUsers/${Number(proj_id)}`)
        setAvailableUsers(response.data)
      } catch (error) {
        console.error("Error trying to get users in the project", error)
      }
    }
    fetchData()
  }, [proj_id])

  const handleResponsibleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setResponsibleInput(value);
    if (value.trim()) {
      const suggestions = availableUsers.filter(user =>
        user.user_email.toLowerCase().includes(value.toLowerCase()) &&
        !responsibles.some(r => r.email === user.user_email)
      );
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const showNotification = (message: string, success: boolean) => {
    if (success) {
      toast.success(message)
    } else {
      toast.error(message)
    }
  }

  useEffect(() => {
    if (!isStageDialogOpen) {
      setNewStage(initialStageState);
    }
  }, [isStageDialogOpen]);

  useEffect(() => {
    if (selectedStage === null) {
      setNewTask(initialTaskState);
    }
  }, [selectedStage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSidebarState = localStorage.getItem('sidebarOpen');
      if (savedSidebarState !== null) {
        setSidebarOpen(savedSidebarState === 'true');
      }
      setInitialized(true);
    }
  }, []);

  // Efeito principal para carregar as etapas
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

      for (const user of responsibles) {
        const relUserTarefa_data = {
          proj_id: Number(response.data.tarefa_id),
          user_id: user?.user_id,
        };

        await axios.post(`http://localhost:3000/tarefa_usuario/associate`, relUserTarefa_data)
      }

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

  const openTaskDetails = (task: Tarefa) => {
    setSelectedTask(task);
    setEditableTask({ ...task });
    setIsTaskDetailsOpen(true);
    setIsEditing(false);
    setSubtasks([]);
    setResponsibles([])
  };

  const addSubtask = () => {
    if (!newSubtaskName.trim()) return;

    const newSubtask: Subtarefa = {
      subtarefa_nome: newSubtaskName,
      subtarefa_concluida: false
    };

    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskName("");
  };

  const removeSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };

  const toggleSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].subtarefa_concluida = !updatedSubtasks[index].subtarefa_concluida;
    setSubtasks(updatedSubtasks);
  };

  const saveTaskChanges = async () => {
    if (!editableTask) return;

    const taskData = {
      id: editableTask.tarefa_id,
      nome: editableTask.tarefa_nome,
      descricao: editableTask.tarefa_descricao,
      data_inicio: editableTask.tarefa_data_inicio,
      data_fim: editableTask.tarefa_data_fim,
      tarefa_status: editableTask.tarefa_status,
    };

    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:3000/tarefa`, taskData);

      for (const user of responsibles) {
        const relUserTarefa_data = {
          proj_id: Number(response.data.tarefa_id),
          user_id: user?.user_id,
        };

        console.log("daiodjioasd",relUserTarefa_data )

        await axios.post(`http://localhost:3000/tarefa_usuario/associate`, relUserTarefa_data)
      }

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

  const deleteTask = async (taskId: number) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/tarefa/${Number(taskId)}`);

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

  if (!authChecked || !initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
      </div>
    );
  }

  const contentMargin = sidebarOpen ? "ml-[250px]" : "ml-[80px]";

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`w-full p-8 ${contentMargin}`}>
        <h2 className="text-2xl font-bold text-gray-800">Etapas do Projeto</h2>
        <div className="pr-8">
          <hr className="border-t-2 border-[#C4D8FF] my-4" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
          </div>
        ) : stages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {stages.map((stage) => (
              <StageCard
                key={stage.etapa_id}
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
                onOpenTaskDetails={openTaskDetails}
              />
            ))}

            <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center justify-center h-full">
                  <Button
                    onClick={() => setIsStageDialogOpen(true)}
                    className="bg-[#355EAF] hover:bg-[#2d4f95] text-white h-16 w-full rounded-lg shadow-md"
                  >
                    + Criar Nova Etapa
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="p-8 bg-white rounded-xl shadow-lg max-w-lg w-full">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">Criar Nova Etapa</DialogTitle>
                </DialogHeader>
                <StageForm
                  stage={newStage}
                  onChange={(field, value) => setNewStage({ ...newStage, [field]: value })}
                  onSubmit={createStage}
                  isSubmitting={loading}
                />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <p className="text-gray-500 text-lg font-light mb-6">Nenhuma etapa criada ainda...</p>
            <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setIsStageDialogOpen(true)}
                  className="bg-[#355EAF] hover:bg-[#2d4f95] text-white px-8 py-6 rounded-lg shadow-md"
                >
                  + Criar Nova Etapa
                </Button>
              </DialogTrigger>
              <DialogContent className="p-8 bg-white rounded-xl shadow-lg max-w-lg w-full">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">Criar Nova Etapa</DialogTitle>
                </DialogHeader>
                <StageForm
                  stage={newStage}
                  onChange={(field, value) => setNewStage({ ...newStage, [field]: value })}
                  onSubmit={createStage}
                  isSubmitting={loading}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}

        {selectedStage && (
          <Dialog open={!!selectedStage} onOpenChange={() => setSelectedStage(null)}>
            <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-lg w-full">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">Adicionar Nova Tarefa</DialogTitle>
              </DialogHeader>
              <TaskForm
                task={newTask}
                onChange={(field, value) => setNewTask({ ...newTask, [field]: value })}
                onSubmit={() => addTask(selectedStage)}
                isSubmitting={loading}
              />
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen}>
          <DialogContent className="p-8 bg-white rounded-xl shadow-lg max-w-[800px] w-full max-h-[80vh] flex flex-col">
            {editableTask && (
              <TaskDetails
                availableUsers={availableUsers}
                task={editableTask}
                subtasks={subtasks}
                responsaveis={responsibles}
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
                onAddResponsavel={(r) => setResponsibles([...responsibles, r])}
                onRemoveResponsavel={(i) => setResponsibles(rs => rs.filter((_, j) => j !== i))}
                onNewSubtaskChange={setNewSubtaskName}
                onSave={saveTaskChanges}
                onCancel={() => {
                  setIsEditing(false);
                  setEditableTask(selectedTask ? { ...selectedTask } : null);
                }}
                onEdit={() => setIsEditing(true)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectTasks;