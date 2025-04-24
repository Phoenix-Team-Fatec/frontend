import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Save, X, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";



interface Subtarefa {
  subtarefa_id?: number;
  subtarefa_nome: string;
  subtarefa_concluida: boolean;
}


interface TaskDetailsProps {
  task: any;
  isEditing: boolean;
  responsaveis: Responsavel[];
  availableUsers: { user_id: number; user_nome: string; user_email: string; user_foto: string; }[];
  newResponsavel: string;
  onTaskChange: (field: string, value: string | boolean) => void;
  onAddResponsavel: (r: Responsavel) => void;
  onRemoveResponsavel: (index: number) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  dialogHeader?: React.ReactNode
}

interface Responsavel {
  email: string;
  user_id?: number;
}


export default function TaskDetails({
  task,
  isEditing,
  responsaveis,
  availableUsers,
  newResponsavel,
  onTaskChange,
  onAddResponsavel,
  onRemoveResponsavel,
  onSave,
  onCancel,
  onEdit
}: TaskDetailsProps) {


  const [responsibleInput, setResponsibleInput] = useState("");
  const [subtasks, setSubtasks] = useState<Subtarefa[]>([]);
  const [newSubtaskName, setNewSubtaskName] = useState("");

  useEffect(() =>{
    const fetchSubtasks = async () => {
      try{
        const {data} =  axios.get("http://localhost:3000/subtarefa/:tarefa_id")
      }catch(error){
        console.log(`Erro ao carregar subtarefas ${error}`)
      }
    }
  })
  

  const [filteredSuggestions, setFilteredSuggestions] =
    useState<TaskDetailsProps["availableUsers"]>([]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleResponsibleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setResponsibleInput(value);
    if (value.trim()) {
      setFilteredSuggestions(
        availableUsers.filter(u =>
          u.user_email.toLowerCase().includes(value.toLowerCase()) &&
          !responsaveis.some(r => r.email === u.user_email)
        )
      );
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleAddResponsible = (emailFromSuggestion?: string) => {
    const email = (emailFromSuggestion ?? responsibleInput).trim();
    if (!emailRegex.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }
    if (responsaveis.some(r => r.email === email)) return;
    const match = availableUsers.find(u => u.user_email === email);
    onAddResponsavel({ email, user_id: match?.user_id });
    setResponsibleInput("");
    setFilteredSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddResponsible();
    }
  };

  const addSubtask = () => {
    if (!newSubtaskName.trim()) return;

    const newSubtask: Subtarefa = {
      subtarefa_nome: newSubtaskName,
      subtarefa_concluida: false
    };

    


    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskName("");
  };

  const removeSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };

  const toggleSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].subtarefa_concluida = !updatedSubtasks[index].subtarefa_concluida;
    setSubtasks(updatedSubtasks);
  };


  const handleSubtaskChange = (index:any, value:any) => {
    const updated = [...subtasks];
    updated[index].subtarefa_nome = value;
    setSubtasks(updated);
  }



  return (




    <div className="space-y-6 mt-4 overflow-y-auto flex-grow">


      {/* Header movido para dentro do componente */}
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center">
          {isEditing ? (
            <input
              value={task.tarefa_nome}
              onChange={(e) => onTaskChange("tarefa_nome", e.target.value)}
              className="text-2xl font-bold border rounded p-2 w-full"
            />
          ) : (
            <h2 className="text-2xl font-bold tracking-tight">
              {task.tarefa_nome}
            </h2>
          )}
          <div className="flex gap-2">
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Pen size={16} className="mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>
        <p className="text-gray-600">Detalhes da tarefa</p>
      </div>
      {/* Responsáveis */}
      {/* Responsáveis */}
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Responsáveis
        </Label>

        {/* input + sugestões */}
        {isEditing && (
          <div className="relative flex gap-2 mb-4">
            <Input
              id="responsible"
              type="email"
              placeholder="usuario@exemplo.com"
              value={responsibleInput}
              onChange={handleResponsibleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />

            {filteredSuggestions.length > 0 && (
              <ul className="absolute z-10 top-full left-0 w-full bg-white border rounded shadow mt-1">
                {filteredSuggestions.map(u => (
                  <li
                    key={u.user_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAddResponsible(u.user_email)}
                  >
                    {u.user_email}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* exibição simples quando não está editando */}
        {!isEditing && responsaveis.length > 0 && (
          <ul className="space-y-2">
            {responsaveis.map((r, idx) => (
              <li key={idx} className="bg-gray-50 p-2 rounded">
                {r.email}
              </li>
            ))}
          </ul>
        )}

        {/* cards quando em edição */}
        {isEditing && responsaveis.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {responsaveis.map((r, idx) => {
              const detalhes = availableUsers.find(u => u.user_email === r.email);
              return (
                <Card key={idx} className="p-4 w-full flex items-center space-x-6">
                  <CardContent className="flex items-center w-full p-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {detalhes?.user_foto ? (
                        <img
                          src={detalhes.user_foto}
                          alt="Foto do usuário"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="flex items-center justify-center h-full text-gray-600 font-medium">
                          {r.email[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium truncate">
                        {detalhes?.user_nome ?? r.email}
                      </p>
                      <p className="text-xs text-gray-500 break-words">{r.email}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveResponsavel(idx)}
                    >
                      <X size={16} />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
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
                  onCheckedChange={() => toggleSubtask(index)}
                />
                {isEditing ? (
                  <div className="flex gap-2 w-full">
                    <Input
                      value={subtask.subtarefa_nome}
                      onChange={(e) => handleSubtaskChange(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubtask(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <Label
                    htmlFor={`subtask-${index}`}
                    className={`text-sm flex-grow ${subtask.subtarefa_concluida
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
                onChange={(e) => setNewSubtaskName(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={addSubtask}
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
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${task.tarefa_status
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