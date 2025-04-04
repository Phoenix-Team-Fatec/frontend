"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar/Sidebar";
import axios from 'axios';
import { useSearchParams } from "next/navigation";

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
  const [newStage, setNewStage] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    status: true
  });
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    nome: "",
    descricao: "",
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tarefa_status: false
  });

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, [proj_id]);

  const createStage = async () => {
    if (!newStage.nome.trim()) return;
    
    try {
      const etapaData = {
        etapaNome: newStage.nome,
        etapaDescricao: newStage.descricao,
        etapaDataInicio: newStage.dataInicio || new Date().toISOString().split('T')[0],
        etapaDataFim: newStage.dataFim || new Date().toISOString().split('T')[0],
        etapaStatus: newStage.status,
        projId: Number(proj_id)
      };

      const response = await axios.post(`http://localhost:3000/etapas`, etapaData);
      
      setStages(prev => [...prev, { ...response.data, tarefas: [] }]);
      setNewStage({
        nome: "",
        descricao: "",
        dataInicio: "",
        dataFim: "",
        status: true
      });
    } catch (error) {
      console.error("Erro ao criar etapa:", error);
      alert("Erro ao criar etapa. Verifique os dados e tente novamente.");
    }
  };

  const addTask = async (etapaId: number) => {
    if (!newTask.nome.trim()) return;
    
    try {
      const response = await axios.post(`http://localhost:3000/tarefa`, {
        ...newTask,
        etapa_id: etapaId
      });

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

      setNewTask({
        nome: "",
        descricao: "",
        data_inicio: new Date().toISOString().split('T')[0],
        data_fim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tarefa_status: false
      });
      setSelectedStage(null);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert(
        axios.isAxiosError(error) 
          ? error.response?.data?.message || "Erro ao criar tarefa"
          : "Erro desconhecido"
      );
    }
  };

  useEffect(() => {
    // Initialize sidebar state from localStorage (only on client-side)
    if (typeof window !== 'undefined') {
      const savedSidebarState = localStorage.getItem('sidebarOpen');
      if (savedSidebarState !== null) {
        setSidebarOpen(savedSidebarState === 'true');
      }
    }
  }, []);
  

  // Calculate content margin based on sidebar state
  const contentMargin = sidebarOpen ? "ml-[250px]" : "ml-[80px]";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`w-full p-8 transition-all duration-300 ${contentMargin}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Etapas do Projeto</h2>
        <div className="pr-8">
          <hr className="border-t-2 border-[#C4D8FF] my-4" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <p className="text-gray-500 text-lg font-light mb-6">Carregando etapas...</p>
            
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

                <div className="space-y-3 flex-grow overflow-y-auto max-h-[50vh]">
                  {(stage.tarefas || []).map((task) => (
                    <Card key={task.tarefa_id} className="border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4">
                        <p className="font-medium text-gray-800 mb-1">{task.tarefa_nome}</p>
                        <p className="text-gray-600 text-sm mb-2">{task.tarefa_descricao}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Início: {new Date(task.tarefa_data_inicio).toLocaleDateString()}</div>
                          <div>Término: {new Date(task.tarefa_data_fim).toLocaleDateString()}</div>
                        </div>
                        <div className={`text-xs mt-2 font-medium py-1 px-2 rounded-full inline-block ${task.tarefa_status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {task.tarefa_status ? "Concluída" : "Pendente"}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center justify-center h-full">
                  <Button className="bg-[#355EAF] hover:bg-[#2d4f95] text-white h-16 w-full rounded-lg shadow-md cursor-pointer">
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
                    onChange={(e) => setNewStage({...newStage, nome: e.target.value})}
                    required
                    className="w-full p-2 border rounded"
                  />
                  
                  <Input
                    placeholder="Descrição"
                    value={newStage.descricao}
                    onChange={(e) => setNewStage({...newStage, descricao: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                      <Input
                        type="date"
                        value={newStage.dataInicio}
                        onChange={(e) => setNewStage({...newStage, dataInicio: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                      <Input
                        type="date"
                        value={newStage.dataFim}
                        onChange={(e) => setNewStage({...newStage, dataFim: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={createStage}
                    disabled={!newStage.nome.trim()}
                    className="w-full bg-[#355EAF] hover:bg-[#2d4f95] text-white font-medium py-2 rounded"
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#355EAF] hover:bg-[#2d4f95] text-white px-6 py-3 rounded-lg shadow-md cursor-pointer">
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
                    onChange={(e) => setNewStage({...newStage, nome: e.target.value})}
                    required
                    className="w-full p-2 border rounded"
                  />
                  
                  <Input
                    placeholder="Descrição"
                    value={newStage.descricao}
                    onChange={(e) => setNewStage({...newStage, descricao: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                      <Input
                        type="date"
                        value={newStage.dataInicio}
                        onChange={(e) => setNewStage({...newStage, dataInicio: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                      <Input
                        type="date"
                        value={newStage.dataFim}
                        onChange={(e) => setNewStage({...newStage, dataFim: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={createStage}
                    disabled={!newStage.nome.trim()}
                    className="w-full bg-[#355EAF] hover:bg-[#2d4f95] text-white font-medium py-2 rounded"
                  >
                    Criar Etapa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {selectedStage && (
          <Dialog open={!!selectedStage} onOpenChange={() => setSelectedStage(null)}>
            <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-lg w-full">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-4">Adicionar Nova Tarefa</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <Input
                  placeholder="Nome da tarefa*"
                  value={newTask.nome}
                  onChange={(e) => setNewTask({...newTask, nome: e.target.value})}
                  required
                  className="w-full p-2 border rounded"
                />
                
                <Input
                  placeholder="Descrição"
                  value={newTask.descricao}
                  onChange={(e) => setNewTask({...newTask, descricao: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                    <Input
                      type="date"
                      value={newTask.data_inicio.split('T')[0]}
                      onChange={(e) => setNewTask({...newTask, data_inicio: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                    <Input
                      type="date"
                      value={newTask.data_fim.split('T')[0]}
                      onChange={(e) => setNewTask({...newTask, data_fim: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={() => addTask(selectedStage)}
                  disabled={!newTask.nome.trim()}
                  className="w-full bg-[#355EAF] hover:bg-[#2d4f95] text-white font-medium py-2 rounded"
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