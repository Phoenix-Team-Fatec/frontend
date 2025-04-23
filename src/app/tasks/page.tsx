"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from 'axios';
import { getUserData } from "@/utils/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Plus } from "lucide-react";

// Componentes
import StageCard from "@/components/StageCard/StageCard";
import StageForm from "@/components/StageForm/StageForm";
import TaskForm from "@/components/TaskForm/TaskForm";
import TaskDetails from "@/components/TaskDetails/TaskDetails";

interface Tarefa {
  tarefa_id: number;
  tarefa_nome: string;
  tarefa_descricao: string;
  tarefa_data_inicio: string;
  tarefa_data_fim: string;
  tarefa_status: boolean;
  responsavel?: string;
}

interface Etapa {
  etapa_id: number;
  etapa_nome: string;
  tarefas?: Tarefa[];
  projId: number;
}

const ProjectTasks = () => {
  const searchParams = useSearchParams();
  const proj_id = searchParams.get('projectId');
  const router = useRouter();

  // Estados
  const [projectName, setProjectName] = useState("");
  const [stages, setStages] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Estados para formulários
  const [newStage, setNewStage] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    status: true
  });

  const [newTask, setNewTask] = useState({
    nome: "",
    descricao: "",
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tarefa_status: false,
    responsavel: ""
  });

  // Estados UI
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Tarefa | null>(null);
  const [editableTask, setEditableTask] = useState<Tarefa | null>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Efeitos
  useEffect(() => {
    const userData = getUserData();
    if (!userData) router.push('/sign-in');
    else setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (proj_id) {
      axios.get(`http://localhost:3000/projeto/getById/${proj_id}`)
        .then(response => setProjectName(response.data.proj_nome))
        .catch(console.error);
    }
  }, [proj_id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarOpen');
      if (savedState !== null) setSidebarOpen(savedState === 'true');
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!initialized || !authChecked || !proj_id) return;

    const fetchStages = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Etapa[]>(`http://localhost:3000/etapas/${Number(proj_id)}`);
        setStages(response.data.map(etapa => ({
          ...etapa,
          tarefas: etapa.tarefas || []
        })));
      } catch (error) {
        console.error("Erro ao buscar etapas:", error);
        setStages([]);
        toast.error("Erro ao carregar etapas");
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, [proj_id, initialized, authChecked]);

  // Funções CRUD
  const createStage = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:3000/etapas`, {
        ...newStage,
        projId: Number(proj_id)
      });
      setStages(prev => [...prev, { ...response.data, tarefas: [] }]);
      setIsStageDialogOpen(false);
      toast.success("Etapa criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar etapa:", error);
      toast.error("Erro ao criar etapa");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (etapaId: number) => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:3000/tarefa`, {
        ...newTask,
        etapa_id: etapaId
      });
      setStages(prev => prev.map(s => 
        s.etapa_id === etapaId 
          ? { ...s, tarefas: [...(s.tarefas || []), response.data] } 
          : s
      ));
      setSelectedStage(null);
      toast.success("Tarefa adicionada!");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      toast.error("Erro ao criar tarefa");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: number) => {
    try {
      const task = stages
        .flatMap(s => s.tarefas || [])
        .find(t => t.tarefa_id === taskId);
      
      if (!task) return;

      const newStatus = !task.tarefa_status;
      await axios.put(`http://localhost:3000/tarefa/${taskId}`, {
        ...task,
        tarefa_status: newStatus
      });

      setStages(prev => prev.map(s => ({
        ...s,
        tarefas: s.tarefas?.map(t => 
          t.tarefa_id === taskId ? { ...t, tarefa_status: newStatus } : t
        ) || []
      })));

      if (editableTask?.tarefa_id === taskId) {
        setEditableTask(prev => ({ ...prev!, tarefa_status: newStatus }));
      }

      toast.success(`Tarefa ${newStatus ? "concluída" : "pendente"}`);
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status");
    }
  };

  const openTaskDetails = (task: Tarefa) => {
    setSelectedTask(task);
    setEditableTask({...task});
    setIsTaskDetailsOpen(true);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsTaskDetailsOpen(false);
  };

  const saveTaskChanges = async () => {
    if (!editableTask) return;
    
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:3000/tarefa/${editableTask.tarefa_id}`,
        editableTask
      );

      setStages(prev => prev.map(s => ({
        ...s,
        tarefas: s.tarefas?.map(t => 
          t.tarefa_id === editableTask.tarefa_id ? response.data : t
        ) || []
      })));

      setIsEditing(false);
      toast.success("Tarefa atualizada!");
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      toast.error("Erro ao atualizar tarefa");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/tarefa/${taskId}`);
      setStages(prev => prev.map(s => ({
        ...s,
        tarefas: s.tarefas?.filter(t => t.tarefa_id !== taskId) || []
      })));
      setIsTaskDetailsOpen(false);
      toast.success("Tarefa excluída");
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      toast.error("Erro ao excluir tarefa");
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
    <div className="flex min-h-screen overflow-x-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={`flex-1 ${contentMargin} transition-all duration-300 p-4 md:p-8 w-full overflow-x-auto`}>
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

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
          </div>
        ) : stages.length > 0 ? (
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
                    if (confirm("Excluir esta tarefa?")) deleteTask(taskId);
                  }}
                  onOpenTaskDetails={openTaskDetails}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <p className="text-gray-500 text-lg font-light mb-6 text-center">
              Nenhuma etapa criada ainda...
            </p>
            <Button
              onClick={() => setIsStageDialogOpen(true)}
              className="bg-[#355EAF] hover:bg-[#2d4f95] text-white px-8 py-6 rounded-lg shadow-md"
            >
              <Plus className="mr-2" size={16} />
              Criar Primeira Etapa
            </Button>
          </div>
        )}

        {/* Modais */}
        <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
          <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-[90vw] w-full max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">
                Criar Nova Etapa
              </DialogTitle>
            </DialogHeader>
            <StageForm
              stage={newStage}
              onChange={(field, value) => setNewStage({...newStage, [field]: value})}
              onSubmit={createStage}
              isSubmitting={loading}
            />
          </DialogContent>
        </Dialog>

        {selectedStage && (
          <Dialog open={!!selectedStage} onOpenChange={() => setSelectedStage(null)}>
            <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-[90vw] w-full max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">
                  Adicionar Nova Tarefa
                </DialogTitle>
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

        <Dialog open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen}>
          <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-[90vw] w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {editableTask && (
              <TaskDetails
                task={editableTask}
                isEditing={isEditing}
                onTaskChange={(field, value) => {
                  setEditableTask(prev => ({ ...prev!, [field]: value }));
                }}
                onSave={saveTaskChanges}
                onCancel={handleCancelEdit}
                onToggleStatus={() => toggleTaskStatus(editableTask.tarefa_id)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectTasks;