"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar/Sidebar"; // 🔹 Importando a Sidebar
import "./tasks.css"; // 🔹 Importando o CSS

// 🔹 Dados simulados antes da integração com backend
const initialStages = [
  {
    id: 1,
    name: "Etapa 1",
    tasks: [
      { id: 1, name: "Planejar Reunião", description: "Definir pauta e horários", assigned: "João Silva" },
    ],
  },
  {
    id: 2,
    name: "Etapa 2",
    tasks: [
      { id: 2, name: "Criar Prototipação", description: "Wireframe no Figma", assigned: "Maria Souza" },
    ],
  },
];

const ProjectTasks = () => {
  const [stages, setStages] = useState(initialStages);
  const [newStage, setNewStage] = useState("");
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({ name: "", description: "", assigned: "" });

  // 🔹 Função para adicionar nova etapa
  const addStage = () => {
    if (newStage.trim() === "") return;
    setStages([...stages, { id: Date.now(), name: newStage, tasks: [] }]);
    setNewStage("");
  };

  // 🔹 Função para adicionar nova tarefa
  const addTask = (stageId: number) => {
    if (newTask.name.trim() === "") return;
    setStages(
      stages.map((stage) =>
        stage.id === stageId
          ? { ...stage, tasks: [...stage.tasks, { id: Date.now(), ...newTask }] }
          : stage
      )
    );
    setNewTask({ name: "", description: "", assigned: "" });
  };

  return (
    <div className="tasks-container">
      <Sidebar /> {/* 🔹 Sidebar fixa no lado esquerdo */}

      <div className="tasks-content">
        <h2 className="tasks-title">Projeto Teste</h2>

        {/* 🔹 Lista de Etapas */}
        <div className="tasks-stages">
          {stages.map((stage) => (
            <div key={stage.id} className="stage-card">
              <h3 className="stage-title">{stage.name}</h3>

              {/* 🔹 Botão para adicionar tarefa */}
              <Button onClick={() => setSelectedStage(stage.id)} className="add-task-button">
                + Adicionar Tarefa
              </Button>

              {/* 🔹 Lista de Tarefas */}
              <div className="tasks-list">
                {stage.tasks.map((task) => (
                  <Card key={task.id} className="task-card">
                    <CardContent className="task-content">
                      <p className="task-name">{task.name}</p>
                      <p className="task-description">{task.description}</p>
                      <p className="task-assigned">{task.assigned}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* 🔹 Botão para adicionar nova etapa */}
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="add-stage-button">+ Adicionar Etapa</Button>
              </DialogTrigger>
              <DialogContent>
                <Input
                  placeholder="Nome da etapa"
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                />
                <Button onClick={addStage} className="mt-2">
                  Salvar
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 🔹 Modal para adicionar nova tarefa */}
        {selectedStage && (
          <Dialog open={!!selectedStage} onOpenChange={() => setSelectedStage(null)}>
            <DialogContent>
              <Input
                placeholder="Nome da tarefa"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
              <Input
                placeholder="Descrição"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <Input
                placeholder="Responsável"
                value={newTask.assigned}
                onChange={(e) => setNewTask({ ...newTask, assigned: e.target.value })}
              />
              <Button onClick={() => addTask(selectedStage)}>Adicionar</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ProjectTasks;
