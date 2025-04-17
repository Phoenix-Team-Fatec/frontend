"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar/Sidebar";
import Popup from "@/components/Feedback/popup";
import axios from 'axios';
import { useRouter, useSearchParams } from "next/navigation";
import { getUserData } from "@/utils/auth";
import { Trash2, Pen } from "lucide-react";
import { Progress } from "@/components/ui/progress"


interface Tarefa {
  tarefa_id: number;
  tarefa_nome: string;
  tarefa_descricao: string;
  tarefa_data_inicio: string;
  tarefa_data_fim: string;
  tarefa_status: boolean;
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
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [responsibles, setResponsibles] = useState<
    { email: string; user_id?: number }[]
  >([]);
  const [availableUsers, setAvailableUsers] = useState<
    { user_id: number; user_nome: string; user_email: string; user_foto: string; }[]
  >([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    { user_id: number; user_nome: string; user_email: string; user_foto: string; }[]
  >([]);
  const [responsibleInput, setResponsibleInput] = useState("");
  const router = useRouter();

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddResponsible = (emailFromSuggestion?: string) => {
    const email = emailFromSuggestion ? emailFromSuggestion.trim() : responsibleInput.trim();
    if (email !== "" && emailRegex.test(email)) {
      if (responsibles.some((r) => r.email === email) || !availableUsers.some((r) => r.user_email === email)) return;

      const userMatch = availableUsers.find((u) => u.user_email === email);
      setResponsibles([
        ...responsibles,
        { email, user_id: userMatch?.user_id }
      ]);
      setResponsibleInput("");
      setFilteredSuggestions(prevSuggestions =>
        prevSuggestions.filter(user => user.user_email !== email)
      );
    } else {
      alert("Por favor, insira um email válido.");
    }
  };

  const handleSuggestionClick = (selectedEmail: string) => {
    handleAddResponsible(selectedEmail);
    setFilteredSuggestions([]);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddResponsible();
    }
  };

  const handleRemoveResponsible = (index: number) => {
    setResponsibles(responsibles.filter((_, i) => i !== index));
  };

  const showNotification = (message: string, success: boolean) => {
    setPopupMessage(message);
    setIsSuccess(success);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

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

  useEffect(() => {
    if (!initialized) return;

    const fetchStages = async () => {
      try {
        const response = await axios.get<Etapa[]>(`http://localhost:3000/etapas/${Number(proj_id)}`);
        const etapasComTarefas = response.data.map(etapa => ({
          ...etapa,
          tarefas: etapa.tarefas || []
        }));
        setStages(etapasComTarefas);
      } catch (error) {
        console.error("Erro ao buscar etapas:", error);
        setStages([]);
      }
    };

    fetchStages();
  }, [proj_id, initialized]);

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

  const createStage = async () => {
    if (!newStage.nome.trim()) return;

    try {
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
    }
  };

  const addTask = async (etapaId: number) => {
    if (!newTask.nome.trim()) return;

    try {
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
    }
  };

  const handleStageDialogChange = (open: boolean) => {
    if (!open) {
      setNewStage(initialStageState);
    }
    setIsStageDialogOpen(open);
  };

  const handleTaskDialogChange = (open: boolean) => {
    if (!open) {
      setNewTask(initialTaskState);
      setSelectedStage(null);
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

      <Popup
        isOpen={showPopup}
        message={popupMessage}
        isSuccess={isSuccess}
        onClose={() => setShowPopup(false)}
      />

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
              <div key={stage.etapa_id} className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold text-[#355EAF] mb-3">{stage.etapa_nome}</h3>
                {stage.etapa_descricao && (
                  <p className="text-gray-600 text-sm mb-4">{stage.etapa_descricao}</p>
                )}
                
                <Button 
                  onClick={() => setSelectedStage(stage.etapa_id)} 
                  className="bg-[#355EAF] hover:bg-[#2d4f95] text-white w-full mb-4 cursor-pointer"
                >
                + Adicionar Tarefa
                </Button>

                {/* Barra de progresso da etapa */}
                {stage.tarefas && stage.tarefas.length > 0 && (
                <div className="mb-4">
                    {(() => {
                      const totalTarefas = stage.tarefas?.length || 0;
                      const tarefasConcluidas = stage.tarefas?.filter(t => t.tarefa_status)?.length || 0;
                      const percentual = Math.round((tarefasConcluidas / totalTarefas) * 100);
              return (
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Progresso: {percentual}%
                </p>
                <Progress value={percentual} className="h-2 bg-gray-200" />
              </div>
      );
                })()}
            </div>
          )}


                <div className="space-y-3 flex-grow overflow-y-auto max-h-[50vh]">
                  {(stage.tarefas || []).map((task) => (
                    <Card key={task.tarefa_id} className="border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      {/* Título e ícones lado a lado */}
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-800">{task.tarefa_nome}</p>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-600 hover:text-blue-800 p-0" 
                            onClick={() => console.log("Editar tarefa", task.tarefa_id)}
                          >
                            <Pen size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:text-red-800 p-0" 
                            onClick={() => console.log("Excluir tarefa", task.tarefa_id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                  
                      {/* Descrição e datas */}
                      <p className="text-gray-600 text-sm mb-2">{task.tarefa_descricao}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Início: {new Date(task.tarefa_data_inicio).toLocaleDateString()}</div>
                        <div>Término: {new Date(task.tarefa_data_fim).toLocaleDateString()}</div>
                      </div>
                  
                      {/* Status */}
                      <div className={`text-xs mt-2 font-medium py-1 px-2 rounded-full inline-block ${task.tarefa_status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {task.tarefa_status ? "Concluída" : "Pendente"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  
                  ))}
                </div>
              </div>
            ))}

            <Dialog open={isStageDialogOpen} onOpenChange={handleStageDialogChange}>
              <DialogTrigger asChild>
                <div className="flex items-center justify-center h-full">
                  <Button
                    onClick={() => setIsStageDialogOpen(true)}
                    className="bg-[#355EAF] hover:bg-[#2d4f95] text-white h-16 w-full rounded-lg shadow-md cursor-pointer"
                  >
                    + Criar Nova Etapa
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="p-8 bg-white rounded-xl shadow-lg max-w-lg w-full">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">Criar Nova Etapa</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <Input
                    placeholder="Nome da etapa"
                    value={newStage.nome}
                    onChange={(e) => setNewStage({ ...newStage, nome: e.target.value })}
                    required
                    className="w-full p-2 border rounded"
                  />

                  <Input
                    placeholder="Descrição"
                    value={newStage.descricao}
                    onChange={(e) => setNewStage({ ...newStage, descricao: e.target.value })}
                    className="w-full p-2 border rounded"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                      <Input
                        type="date"
                        value={newStage.dataInicio}
                        onChange={(e) => setNewStage({ ...newStage, dataInicio: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                      <Input
                        type="date"
                        value={newStage.dataFim}
                        onChange={(e) => setNewStage({ ...newStage, dataFim: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={createStage}
                    disabled={!newStage.nome.trim()}
                    className="w-full bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] font-medium py-2 rounded cursor-pointer"
                  >
                    Criar Etapa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <p className="text-gray-500 text-lg font-light mb-6">Nenhuma etapa criada ainda...</p>
            <Dialog open={isStageDialogOpen} onOpenChange={handleStageDialogChange}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setIsStageDialogOpen(true)}
                  className="bg-[#355EAF] hover:bg-[#2d4f95] text-white px-8 py-6 rounded-lg shadow-md cursor-pointer"
                >
                  + Criar Nova Etapa
                </Button>
              </DialogTrigger>
              <DialogContent className="p-8 bg-white rounded-xl shadow-lg max-w-lg w-full">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">Criar Nova Etapa</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <Input
                    placeholder="Nome da etapa"
                    value={newStage.nome}
                    onChange={(e) => setNewStage({ ...newStage, nome: e.target.value })}
                    required
                    className="w-full p-2 border rounded"
                  />

                  <Input
                    placeholder="Descrição"
                    value={newStage.descricao}
                    onChange={(e) => setNewStage({ ...newStage, descricao: e.target.value })}
                    className="w-full p-2 border rounded"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                      <Input
                        type="date"
                        value={newStage.dataInicio}
                        onChange={(e) => setNewStage({ ...newStage, dataInicio: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                      <Input
                        type="date"
                        value={newStage.dataFim}
                        onChange={(e) => setNewStage({ ...newStage, dataFim: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={createStage}
                    disabled={!newStage.nome.trim()}
                    className="w-full bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] font-medium py-2 rounded cursor-pointer"
                  >
                    Criar Etapa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {selectedStage && (
          <Dialog open={!!selectedStage} onOpenChange={handleTaskDialogChange}>
            <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-lg w-full">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">Adicionar Nova Tarefa</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  placeholder="Nome da tarefa"
                  value={newTask.nome}
                  onChange={(e) => setNewTask({ ...newTask, nome: e.target.value })}
                  required
                  className="w-full p-2 border rounded"
                />

                <Input
                  placeholder="Descrição"
                  value={newTask.descricao}
                  onChange={(e) => setNewTask({ ...newTask, descricao: e.target.value })}
                  className="w-full p-2 border rounded"
                />

                <div>
                  <div className="relative">
                    <Input
                      id="responsible"
                      type="email"
                      placeholder="teste@example.com"
                      value={responsibleInput}
                      onChange={handleResponsibleInputChange}
                      onKeyDown={handleKeyDown}
                      className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500"
                    />
                    {filteredSuggestions.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow-lg">
                        {filteredSuggestions.map((user) => (
                          <li
                            key={user.user_id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(user.user_email)}
                          >
                            {user.user_email}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {responsibles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {responsibles.map((userData, index) => {
                        // Busca detalhes do usuário se existir
                        const userDetails = availableUsers.find((user) => user.user_email === userData.email);
                        return (
                          <div
                            key={index}
                            className="relative flex items-center bg-gray-100 border border-gray-200 rounded-full shadow-sm transition hover:shadow-md px-3 py-1"
                          >
                            {/* Label menor com hover controlando tooltip e botão */}
                            <div className="group relative flex items-center cursor-default">
                              {/* Avatar ou inicial */}
                              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 overflow-hidden">
                                {userDetails?.user_foto && (
                                  <>
                                    <img
                                      src={userDetails.user_foto}
                                      alt="Foto do usuário"
                                      className={"w-5 h-5 rounded-full block group-hover:hidden"}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveResponsible(index)}
                                      className="hidden group-hover:block w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </>
                                )}
                              </div>

                              {/* Email */}
                              <span className="ml-2 text-sm text-gray-800">{userData.email}</span>

                              {/* Tooltip (detalhes) */}
                              <div className="absolute left-0 top-full mt-1 w-max p-2 bg-white border border-gray-300 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-20">
                                {userDetails ? (
                                  <div className="text-xs text-gray-600">
                                    <img
                                      src={userDetails.user_foto}
                                      alt="Foto do usuário"
                                      className="w-10 h-10 rounded-full mb-1"
                                    />
                                    <p><strong>Nome:</strong> {userDetails.user_nome}</p>
                                    <p><strong>Email:</strong> {userDetails.user_email}</p>
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-600">
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 mb-1">
                                      {userData.email.charAt(0).toUpperCase()}
                                    </div>
                                    <p><strong>Usuário não cadastrado</strong></p>
                                    <p>{userData.email}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                    <Input
                      type="date"
                      value={newTask.data_inicio.split('T')[0]}
                      onChange={(e) => setNewTask({ ...newTask, data_inicio: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                    <Input
                      type="date"
                      value={newTask.data_fim.split('T')[0]}
                      onChange={(e) => setNewTask({ ...newTask, data_fim: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => addTask(selectedStage)}
                  disabled={!newTask.nome.trim()}
                  className="w-full bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] font-medium py-2 rounded cursor-pointer"
                >
                  Adicionar Tarefa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ProjectTasks;