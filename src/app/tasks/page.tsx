"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar/Sidebar";
import "./tasks.css";
import axios from 'axios';
import { useParams } from "next/navigation";

interface Tarefa {
  id: number;
  name: string;
  description: string;
}

interface Etapa {
  etapa_id: number;
  etapa_nome: string;
  etapa_descricao?: string;
  etapa_data_inicio?: string;
  etapa_data_fim?: string;
  etapa_status?: boolean;
  tarefas?: Tarefa[]; // Torna opcional
  usuarios?: any[];
  projId: number;
}

const ProjectTasks = () => {
  // const { proj_id } = useParams();
  const [stages, setStages] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStage, setNewStage] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    status: true
  });
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await axios.get<Etapa[]>(`http://localhost:3000/etapas/${1}`);
        // Garante que cada etapa tenha um array de tarefas
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
  }, []);

  const createStage = async () => {
    if (!newStage.nome.trim()) return;
    
    try {
      const etapaData = {
        etapaNome: newStage.nome,
        etapaDescricao: newStage.descricao,
        etapaDataInicio: newStage.dataInicio || new Date().toISOString().split('T')[0],
        etapaDataFim: newStage.dataFim || new Date().toISOString().split('T')[0],
        etapaStatus: newStage.status,
        projId: 1
      };

      const response = await axios.post(`http://localhost:3000/etapas`, etapaData);
      
      // Adiciona a nova etapa com array de tarefas vazio
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

  const addTask = (stageId: number) => {
    if (newTask.name.trim() === "") return;
    
    setStages(prevStages =>
      prevStages.map(stage =>
        stage.etapa_id === stageId
          ? {
              ...stage,
              tarefas: [
                ...(stage.tarefas || []), // Garante que tarefas existe
                { id: Date.now(), ...newTask }
              ]
            }
          : stage
      )
    );
    setNewTask({ name: "", description: "" });
    setSelectedStage(null);
  };

  if (loading) {
    return <div className="loading">Carregando etapas...</div>;
  }

  return (
    <div className="tasks-container">
      <Sidebar />

      <div className="tasks-content">
        <h2 className="tasks-title">Etapas do Projeto</h2>

        <div className="tasks-stages">
          {stages.length > 0 ? (
            stages.map((stage) => (
              <div key={stage.etapa_id} className="stage-card">
                <h3 className="stage-title">{stage.etapa_nome}</h3>
                {stage.etapa_descricao && <p className="stage-description">{stage.etapa_descricao}</p>}

                <Button 
                  onClick={() => setSelectedStage(stage.etapa_id)} 
                  className="add-task-button"
                >
                  + Adicionar Tarefa
                </Button>

                <div className="tasks-list">
                  {(stage.tarefas || []).map((task) => ( // Garante que tarefas existe
                    <Card key={task.id} className="task-card">
                      <CardContent className="task-content">
                        <p className="task-name">{task.name}</p>
                        <p className="task-description">{task.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-stages">
              <p>Nenhuma etapa criada ainda.</p>
            </div>
          )}

          {/* Modal para criar nova etapa */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="add-stage-button">
                + Criar Nova Etapa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Etapa</DialogTitle>
              </DialogHeader>
              
              <Input
                placeholder="Nome da etapa*"
                value={newStage.nome}
                onChange={(e) => setNewStage({...newStage, nome: e.target.value})}
                required
              />
              
              <Input
                placeholder="Descrição"
                value={newStage.descricao}
                onChange={(e) => setNewStage({...newStage, descricao: e.target.value})}
              />
              
              <div className="date-inputs">
                <Input
                  type="date"
                  label="Data de Início"
                  value={newStage.dataInicio}
                  onChange={(e) => setNewStage({...newStage, dataInicio: e.target.value})}
                />
                
                <Input
                  type="date"
                  label="Data de Término"
                  value={newStage.dataFim}
                  onChange={(e) => setNewStage({...newStage, dataFim: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={createStage}
                disabled={!newStage.nome.trim()}
              >
                Criar Etapa
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Modal para adicionar tarefa */}
        {selectedStage && (
          <Dialog open={!!selectedStage} onOpenChange={() => setSelectedStage(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
              </DialogHeader>
              
              <Input
                placeholder="Nome da tarefa*"
                value={newTask.name}
                onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                required
              />
              
              <Input
                placeholder="Descrição"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
              
              <Button 
                onClick={() => addTask(selectedStage)}
                disabled={!newTask.name.trim()}
              >
                Adicionar Tarefa
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ProjectTasks;