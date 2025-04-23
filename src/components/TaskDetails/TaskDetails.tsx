"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";

interface TaskDetailsProps {
  task: any;
  isEditing: boolean;
  onTaskChange: (field: string, value: string | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  onToggleStatus?: () => void;
}

export default function TaskDetails({
  task,
  isEditing,
  onTaskChange,
  onSave,
  onCancel,
  onToggleStatus
}: TaskDetailsProps) {
  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div 
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 cursor-pointer ${
            task.tarefa_status 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}
          onClick={onToggleStatus}
        >
          {task.tarefa_status ? "Concluída" : "Pendente"}
        </div>

        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-500 mb-1">Nome</Label>
            <p className="text-gray-800 font-medium">{task.tarefa_nome}</p>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-500 mb-1">Descrição</Label>
            <p className="text-gray-700 whitespace-pre-line">
              {task.tarefa_descricao || "Nenhuma descrição fornecida"}
            </p>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-500 mb-1">Responsável</Label>
            <p className="text-gray-700">{task.responsavel || "Não definido"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">Início</Label>
              <p className="text-gray-700">
                {new Date(task.tarefa_data_inicio).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">Término</Label>
              <p className="text-gray-700">
                {new Date(task.tarefa_data_fim).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <Button 
          variant="outline"
          onClick={() => onTaskChange("editMode", true)}
          className="w-full mt-6"
        >
          Editar Tarefa
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">Nome da Tarefa*</Label>
        <Input
          value={task.tarefa_nome}
          onChange={(e) => onTaskChange("tarefa_nome", e.target.value)}
          required
          className="w-full"
        />
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">Descrição</Label>
        <Textarea
          value={task.tarefa_descricao}
          onChange={(e) => onTaskChange("tarefa_descricao", e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">Responsável</Label>
        <Input
          value={task.responsavel || ""}
          onChange={(e) => onTaskChange("responsavel", e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">Data de Início*</Label>
          <Input
            type="date"
            value={task.tarefa_data_inicio.split('T')[0]}
            onChange={(e) => onTaskChange("tarefa_data_inicio", e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">Data de Término*</Label>
          <Input
            type="date"
            value={task.tarefa_data_fim.split('T')[0]}
            onChange={(e) => onTaskChange("tarefa_data_fim", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="task-status"
          checked={task.tarefa_status}
          onCheckedChange={(checked) => {
            if (typeof checked === 'boolean') {
              onTaskChange("tarefa_status", checked);
            }
          }}
        />
        <Label htmlFor="task-status" className="text-sm font-medium">
          Tarefa concluída
        </Label>
      </div>

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
          disabled={!task.tarefa_nome.trim() || !task.tarefa_data_inicio || !task.tarefa_data_fim}
          className="flex-1"
        >
          <Save size={16} className="mr-2" />
          Salvar
        </Button>
      </div>
    </div>
  );
}