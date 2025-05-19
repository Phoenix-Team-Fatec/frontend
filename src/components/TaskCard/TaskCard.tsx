import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: {
    tarefa_id: number;
    tarefa_nome: string;
    tarefa_descricao: string;
    tarefa_data_inicio: string;
    tarefa_data_fim: string;
    tarefa_status: boolean;
    pontos_historias:number
  };
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isCoordenador: Boolean;
}

export default function TaskCard({ task, onClick, onEdit, onDelete, isCoordenador }: TaskCardProps) {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-1">
          <p
            className="font-medium text-gray-800 cursor-pointer hover:text-[#355EAF]"
            onClick={onClick}
          >
            {task.tarefa_nome}
          </p>
          <div className="flex gap-2">
            {isCoordenador && (
              <>
                < Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-600 hover:text-blue-800 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pen size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-800 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-2">{task.tarefa_descricao}</p>
        <div className="text-xs text-gray-500 space-y-1">
          <div className="text-gray-600 text-sm mb-2">Pontos de História: {task.pontos_historias}</div>
          <br />
         <div>Início: {new Date(task.tarefa_data_inicio).toLocaleDateString()}</div>
          <div>Término: {new Date(task.tarefa_data_fim).toLocaleDateString()}</div> 
        </div>

        <div className={`text-xs mt-2 font-medium py-1 px-2 rounded-full inline-block ${task.tarefa_status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}>
          {task.tarefa_status ? "Concluída" : "Pendente"}
        </div>
      </CardContent>
    </Card >
  );
}