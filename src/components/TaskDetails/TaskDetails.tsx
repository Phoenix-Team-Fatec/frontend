import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Save, X, Pen, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";



interface Subtarefa {
  subtarefa_id?: number;
  subtarefa_nome: string;
  subtarefa_status: boolean;
  tarefa_id: number
}


interface TaskDetailsProps {
  task: any;
  isEditing: boolean;
  responsaveis: Responsavel[];
  availableUsers: { user_id: number; user_nome: string; user_email: string; user_foto: string; }[];
  newResponsavel: string;
  onTaskChange: (field: string, value: string | boolean) => void;
  onAddResponsavel: (r: Responsavel) => void;
  onRemoveResponsavel: (userId: number, index: number) => void;
  onNewSubtaskChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  dialogHeader?: React.ReactNode;
  isCoordenador: Boolean;
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
  onEdit,
  isCoordenador
}: TaskDetailsProps) {


  const [responsibleInput, setResponsibleInput] = useState("");
  const [subtasks, setSubtasks] = useState<Subtarefa[]>([]);
  const [subtasksUpdate, setSubtasksUpdate] = useState<Subtarefa[]>([]);
  const [newSubtaskName, setNewSubtaskName] = useState("");


  useEffect(() => {
    const fetchSubtasks = async () => {
      try {

        const tarefa_id = task.tarefa_id

        const { data } = await axios.get(`http://localhost:3000/subtarefa/${tarefa_id}`)

        const formated_subtarefas = data.map((subtarefa: any) => ({
          subtarefa_id: subtarefa.subtarefa_id,
          subtarefa_nome: subtarefa.subtarefa_nome,
          subtarefa_status: subtarefa.subtarefa_status
        }));


        console.log(formated_subtarefas)
        if (formated_subtarefas) {
          setSubtasks(formated_subtarefas)
          setSubtasksUpdate(formated_subtarefas)
        } else {
          setSubtasks([])
        }


      } catch (error) {
        console.log(`Erro ao carregar subtarefas ${error}`)
      }
    }
    fetchSubtasks();
  }, [])


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

  const addSubtask = async () => {
    if (!newSubtaskName.trim()) return;

    try {
      const newSubtask = {
        nome: newSubtaskName,
        subtarefa_status: false,
        tarefa_id: task.tarefa_id
      };


      console.log(newSubtask)

      const response = await axios.post("http://localhost:3000/subtarefa", newSubtask)
      const subTarefaId = response.data.subtarefa_id

      const { data } = await axios.get(`http://localhost:3000/tarefa/${task.tarefa_id}`)



      const ids_users = data[0]?.usuarios?.map((user: any) => user.user_id);


      console.log(ids_users)

      for(let id of ids_users) {
        const relSubTarefaData = {
          user_id: id,
          subtarefa_id: subTarefaId
        }

        await axios.post("http://localhost:3000/subtarefa_usuario/associate", relSubTarefaData)
      }

      setSubtasks(prev => [...prev, response.data]);
      setSubtasksUpdate(prev => [...prev, response.data]);
      setNewSubtaskName("");
    } catch (error) {
      console.log(`Erro ao criar tarefa: ${error}`)
    }
  };

  const removeSubtask = async (subtarefa_id: number) => {

    try {

      const response = await axios.delete(`http://localhost:3000/subtarefa/${subtarefa_id}`)

      setSubtasks(prev => prev.filter(subtarefa => subtarefa.subtarefa_id != subtarefa_id))
    } catch (error) {
      console.log(`Erro ao excluir subtarefa`)
    }

  };

  const toggleSubtask = async (subtarefa_id: number) => {
    try {

      const subtarefa_data = {
        subtarefa_id: subtarefa_id,
        subtarefa_status: true
      }

      console.log(subtarefa_data)

      const response = await axios.put(`http://localhost:3000/subtarefa`, subtarefa_data)


      const updatedSubtasks = subtasks.map(sub =>
        sub.subtarefa_id === subtarefa_id
          ? { ...sub, subtarefa_status: !sub.subtarefa_status }
          : sub
      );

      setSubtasks(updatedSubtasks);



    } catch (error) {
      console.log(`Erro ao atualizar status de subtarefa: ${error}`)
    }

  };

  const toggleSubtaskFalse = async (subtarefa_id: number) => {
    try {
      const subtarefa_data = {
        subtarefa_id,
        subtarefa_status: false,
      };

      await axios.put(`http://localhost:3000/subtarefa`, subtarefa_data);

      const updatedSubtasks = subtasks.map(sub =>
        sub.subtarefa_id === subtarefa_id
          ? { ...sub, subtarefa_status: false }
          : sub
      );

      setSubtasks(updatedSubtasks);
    } catch (error) {
      console.log(`Erro ao atualizar status de subtarefa para false: ${error}`);
    }
  };



  const handleSubtaskChange = (id:number, newValue:string) => {
    
    setSubtasks(prevSubtasks => 
      prevSubtasks.map(subtask => 
        subtask.subtarefa_id === id 
          ? { ...subtask, subtarefa_nome: newValue } 
          : subtask
      )
    );
    setSubtasksUpdate(prevSubtasks => 
      prevSubtasks.map(subtask => 
        subtask.subtarefa_id === id 
          ? { ...subtask, subtarefa_nome: newValue } 
          : subtask
      )
    );
  };


  const handleUpdateSubtaskName = async () => {
    try {
      const results = await Promise.all(
        subtasksUpdate.map(async sub => {
          const response = await axios.put(`http://localhost:3000/subtarefa`, {
            subtarefa_id: sub.subtarefa_id,
            nome: sub.subtarefa_nome // Mantenha o mesmo nome do campo
          });
          return response.data;
        })
      );
      
      console.log("Todas as subtarefas foram atualizadas:", results);
      return results;
      
    } catch (error) {
      console.error("Falha ao atualizar subtarefas:", error);
      throw error;
    }
  };
 



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
            {!isEditing && isCoordenador && (
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
                      onClick={() => onRemoveResponsavel(r.user_id!, idx)}
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
          {subtasks.map((subtask) => (
            <div key={subtask.subtarefa_id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center space-x-2 flex-grow">
                <Checkbox
                  id={`subtask-${subtask.subtarefa_id}`}
                  checked={subtask.subtarefa_status}
                  onCheckedChange={() => toggleSubtask(Number(subtask.subtarefa_id))}
                />
                {isEditing ? (
                  <div className="flex gap-2 w-full">
                    <Input
                      value={subtask.subtarefa_nome}
                      onChange={(e) => {
                        handleSubtaskChange(Number(subtask.subtarefa_id), e.target.value);
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      title="Desmarcar como feita"
                      onClick={() => toggleSubtaskFalse(Number(subtask.subtarefa_id))}
                    >
                      <Undo2 size={16} /> {/* Ícone de "desfazer" do Lucide */}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubtask(Number(subtask.subtarefa_id))}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <Label
                    htmlFor={`subtask-${subtask.subtarefa_id}`}
                    className={`text-sm flex-grow ${subtask.subtarefa_status
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

      {/* {Pontos Historia} */}
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">Pontos de História</Label>
        {isEditing ? (
          <Input
            value={task.pontos_historias}
            onChange={(e) => onTaskChange("pontos_historias", e.target.value)}
            className="min-h-[100px]"
          />
        ) : (
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-700">
              {task.pontos_historias || "Nenhum ponto de história fornecido"}
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
            className="flex-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await onSave();
                await handleUpdateSubtaskName();
                // Adicione feedback visual de sucesso
              } catch (error) {
                // Adicione tratamento de erro visual
              }
            }}
            className="flex-1 bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] cursor-pointer"
          >
            <Save size={16} className="mr-2" />
            Salvar
          </Button>
        </div>
      ) : (
        isCoordenador && (
          <Button
            variant="outline"
            onClick={onEdit}
            className="w-full mt-4"
          >
            Editar Tarefa
          </Button>
        )
      )}
    </div>
  );
}