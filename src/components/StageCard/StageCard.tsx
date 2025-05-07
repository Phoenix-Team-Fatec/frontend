
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import TaskCard from "../TaskCard/TaskCard";
import { Trash2, Pencil } from "lucide-react";
import { EditStageModal } from "../EditStageModal/EditStageModal";

interface StageCardProps {
  stage: {
    etapa_id: number;
    etapa_nome: string;
    etapa_descricao?: string;
    tarefas?: Array<{
      tarefa_id: number;
      tarefa_nome: string;
      tarefa_descricao: string;
      tarefa_data_inicio: string;
      tarefa_data_fim: string;
      tarefa_status: boolean;
    }>;
  };
  minDate: Date,
  maxDate: Date,
  isCoordenador: Boolean,
  onAddTask: (stageId: number, minDate: Date, maxDate: Date) => void;
  onEditTask: (task: any) => void;
  onDeleteTask: (taskId: number) => void;
  onOpenTaskDetails: (task: any) => void;
  onDeleteStage: (stageId: number) => void;
  onEditStage: (stageId: number, newName: string, newDescription: string, dataInicio:string, dataFim:string) => void;
}

export default function StageCard({
  stage,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onOpenTaskDetails,
  onDeleteStage,
  onEditStage,
  minDate,
  maxDate,
  isCoordenador
}: StageCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const totalTarefas = stage.tarefas?.length || 0;
  const tarefasConcluidas = stage.tarefas?.filter(t => t.tarefa_status)?.length || 0;
  const percentual = totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-[#355EAF]">{stage.etapa_nome}</h3>
        <div className="flex gap-1">
          {isCoordenador && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-gray-500 hover:text-[#355EAF] hover:bg-[#355EAF]/10"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {isCoordenador && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteStage(stage.etapa_id)}
              className="text-gray-500 hover:text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Modal de edição */}
      <EditStageModal
        stage={stage}
        onSave={onEditStage}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />

      {/* Resto do componente */}
      {stage.etapa_descricao && (
        <p className="text-gray-600 text-sm mb-4">{stage.etapa_descricao}</p>
      )}
      {isCoordenador && (
        <Button
          onClick={() => onAddTask(
            stage.etapa_id,
            minDate,
            maxDate
          )}
          className="bg-[#355EAF] hover:bg-[#2d4f95] text-white w-full mb-4"
        >
          + Adicionar Tarefa
        </Button>
      )}

      {stage.tarefas && stage.tarefas.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Progresso: {percentual}%</p>
          <Progress value={percentual} className="h-2 bg-gray-200" />
        </div>
      )}

      <div className="space-y-3 flex-grow overflow-y-auto max-h-[50vh]">
        {(stage.tarefas || []).map((task) => (
          <TaskCard
            key={task.tarefa_id}
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.tarefa_id)}
            onClick={() => onOpenTaskDetails(task)}
            isCoordenador={isCoordenador}
          />
        ))}
      </div>
    </div>
  );
}