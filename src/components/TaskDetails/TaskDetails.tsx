import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Save, X } from "lucide-react";

interface TaskDetailsProps {
  task: any;
  isEditing: boolean;
  subtasks: any[];
  responsaveis: string[];
  newSubtaskName: string;
  newResponsavel: string;
  onTaskChange: (field: string, value: string | boolean) => void;
  onAddSubtask: () => void;
  onRemoveSubtask: (index: number) => void;
  onToggleSubtask: (index: number) => void;
  onSubtaskChange: (index: number, value: string) => void;
  onAddResponsavel: () => void;
  onRemoveResponsavel: (index: number) => void;
  onResponsavelChange: (index: number, value: string) => void;
  onNewSubtaskChange: (value: string) => void;
  onNewResponsavelChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export default function TaskDetails({
  task,
  isEditing,
  subtasks,
  responsaveis,
  newSubtaskName,
  newResponsavel,
  onTaskChange,
  onAddSubtask,
  onRemoveSubtask,
  onToggleSubtask,
  onSubtaskChange,
  onAddResponsavel,
  onRemoveResponsavel,
  onResponsavelChange,
  onNewSubtaskChange,
  onNewResponsavelChange,
  onSave,
  onCancel,
  onEdit,
}: TaskDetailsProps) {
  return (
    <div className="space-y-6 mt-4 overflow-y-auto flex-grow">
      {/* Responsáveis */}
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">Responsáveis</Label>
        <div className="space-y-2">
          {responsaveis.map((responsavel, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              {isEditing ? (
                <div className="flex gap-2 w-full">
                  <Input
                    value={responsavel}
                    onChange={(e) => onResponsavelChange(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onRemoveResponsavel(index)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <span>{responsavel}</span>
              )}
            </div>
          ))}
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar responsável"
                value={newResponsavel}
                onChange={(e) => onNewResponsavelChange(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAddResponsavel}
                disabled={!newResponsavel.trim()}
              >
                <Plus size={16} className="mr-1" />
                Adicionar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-tarefas */}
      <div className="max-h-[300px] overflow-y-auto">
        <Label className="block text-sm font-medium text-gray-700 mb-2">Sub-tarefas</Label>
        <div className="space-y-2">
          {subtasks.map((subtask, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center space-x-2 flex-grow">
                <Checkbox
                  id={`subtask-${index}`}
                  checked={subtask.subtarefa_concluida}
                  onCheckedChange={() => onToggleSubtask(index)}
                />
                {isEditing ? (
                  <div className="flex gap-2 w-full">
                    <Input
                      value={subtask.subtarefa_nome}
                      onChange={(e) => onSubtaskChange(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onRemoveSubtask(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <Label
                    htmlFor={`subtask-${index}`}
                    className={`text-sm flex-grow ${
                      subtask.subtarefa_concluida 
                        ? 'line-through text-gray-500 decoration-2' 
                        : 'text-gray-800'
                    }`}
                  >
                    {subtask.subtarefa_nome}
                  </Label>
                )}
              </div>
            </div>
          ))}
          {isEditing && (
            <div className="flex gap-2 sticky bottom-0 bg-white pt-2">
              <Input
                placeholder="Adicionar sub-tarefa"
                value={newSubtaskName}
                onChange={(e) => onNewSubtaskChange(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAddSubtask}
                disabled={!newSubtaskName.trim()}
              >
                <Plus size={16} className="mr-1" />
                Adicionar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Descrição */}
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">Descrição</Label>
        {isEditing ? (
          <Textarea
            value={task.tarefa_descricao}
            onChange={(e) => onTaskChange("tarefa_descricao", e.target.value)}
            className="min-h-[100px]"
          />
        ) : (
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-700">
              {task.tarefa_descricao || "Nenhuma descrição fornecida"}
            </p>
          </div>
        )}
      </div>

      {/* Datas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</Label>
          {isEditing ? (
            <Input
              type="date"
              value={task.tarefa_data_inicio.split('T')[0]}
              onChange={(e) => onTaskChange("tarefa_data_inicio", e.target.value)}
            />
          ) : (
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-700">
                {new Date(task.tarefa_data_inicio).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Data de Término</Label>
          {isEditing ? (
            <Input
              type="date"
              value={task.tarefa_data_fim.split('T')[0]}
              onChange={(e) => onTaskChange("tarefa_data_fim", e.target.value)}
            />
          ) : (
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-700">
                {new Date(task.tarefa_data_fim).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">Status</Label>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="task-status"
              checked={task.tarefa_status}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  onTaskChange("tarefa_status", checked);
                }
              }}
            />
            <Label htmlFor="task-status">
              {task.tarefa_status ? "Concluída" : "Pendente"}
            </Label>
          </div>
        ) : (
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            task.tarefa_status 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {task.tarefa_status ? "Concluída" : "Pendente"}
          </div>
        )}
      </div>

      {/* Botões de ação */}
      {isEditing ? (
        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            variant="default"
            onClick={onSave}
            className="flex-1"
          >
            <Save size={16} className="mr-2" />
            Salvar
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline"
          onClick={onEdit}
          className="w-full mt-4"
        >
          Editar Tarefa
        </Button>
      )}
    </div>
  );
}