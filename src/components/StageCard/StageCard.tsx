import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import TaskCard from "../TaskCard/TaskCard";
import { Trash2 } from "lucide-react";

interface Tarefa {
  tarefa_id: number;
  tarefa_nome: string;
  tarefa_descricao: string;
  tarefa_data_inicio: string;
  tarefa_data_fim: string;
  tarefa_status: boolean;
}

interface Stage {
  etapa_id: number;
  etapa_nome: string;
  etapa_descricao?: string;
  tarefas?: Tarefa[];
}

interface StageCardProps {
  stage: Stage;
  onAddTask: (stageId: number) => void;
  onEditTask: (task: Tarefa) => void;
  onDeleteTask: (taskId: number) => void;
  onOpenTaskDetails: (task: Tarefa) => void;
  onDeleteStage: (stageId: number) => void;
}

export default function StageCard({
  stage,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onOpenTaskDetails,
  onDeleteStage,
}: StageCardProps) {
  const tarefas = stage.tarefas ?? [];
  const tarefasConcluidas = tarefas.filter(t => t.tarefa_status).length;
  const progresso = tarefas.length > 0 ? Math.round((tarefasConcluidas / tarefas.length) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full border border-gray-200">
      {/* Título da etapa e botão de deletar */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-[#355EAF]">{stage.etapa_nome}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDeleteStage(stage.etapa_id)}
          className="text-gray-500 hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {stage.etapa_descricao && (
        <p className="text-gray-600 text-sm mb-4">{stage.etapa_descricao}</p>
      )}

      {/* Botão para adicionar tarefa */}
      <Button 
        onClick={() => onAddTask(stage.etapa_id)} 
        className="bg-[#355EAF] hover:bg-[#2d4f95] text-white w-full mb-4"
      >
        + Adicionar Tarefa
      </Button>

      {/* Barra de progresso */}
      {tarefas.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Progresso: {progresso}%</p>
          <Progress value={progresso} className="h-2 bg-gray-200" />
        </div>
      )}

      {/* Lista de tarefas */}
      <div className="space-y-3 flex-grow overflow-y-auto max-h-[50vh]">
        {tarefas.map((task) => (
          <TaskCard
            key={task.tarefa_id}
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.tarefa_id)}
            onClick={() => onOpenTaskDetails(task)}
          />
        ))}
      </div>
    </div>
  );
}
