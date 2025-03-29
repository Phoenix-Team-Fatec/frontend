import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CardProps {
  id: number;
  projeto_proj_nome: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number; // Percentual de progresso
  users: string[]; // Lista de usuários (nomes ou identificadores dos usuários)
  onDelete: (id: number) => void; // Função de exclusão
  fetchProjectData: (id: number) => void; // Função para atualizar dados do projeto
}

export default function Cards_Projects({
  id,
  projeto_proj_nome,
  description,
  startDate,
  endDate,
  progress,
  users = [], // Definir um valor padrão para users como array vazio
  onDelete,
  fetchProjectData,
}: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectData, setProjectData] = useState({
    projeto_proj_nome,
    description,
    startDate,
    endDate,
  });

  useEffect(() => {
    // Verifica se a função fetchProjectData está definida antes de chamá-la
    if (typeof fetchProjectData === "function") {
      fetchProjectData(id);
    } else {
      console.error("fetchProjectData não é uma função");
    }
  }, [id, fetchProjectData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Lógica de salvar alterações no projeto
    console.log("Projeto atualizado:", projectData);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    onDelete(id); // Chama a função de exclusão recebida via props
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Card className="w-[300px] h-[130px] bg-gray-200 p-4 rounded-lg shadow-md relative">
        <div className="absolute top-2 right-2 flex space-x-2 text-gray-600">
          <Pencil
            size={16}
            className="cursor-pointer hover:text-black"
            onClick={() => setIsModalOpen(true)}
          />
          <Trash
            size={16}
            className="cursor-pointer hover:text-red-500"
            onClick={() => setIsDeleteModalOpen(true)}
          />
          <MoreVertical size={16} className="cursor-pointer" />
        </div>

        <CardContent className="p-0">
          <h2 className="text-sm font-bold text-gray-900">{projectData.projeto_proj_nome}</h2>
          <p className="text-xs text-gray-500">{projectData.description}</p>

          {/* Verificar se users não está vazio ou indefinido */}
          <div className="flex items-center mt-2 space-x-[-8px]">
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <Avatar key={index} className="w-6 h-6 border border-white">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">{user[0]}</AvatarFallback> {/* Exibe a primeira letra do nome */}
                </Avatar>
              ))
            ) : (
              <span className="text-xs text-gray-500">Nenhum usuário</span>
            )}
            {users.length < 4 && (
              <Avatar className="w-6 h-6 bg-white text-xs border border-gray-300">
                +{users.length}
              </Avatar>
            )}
          </div>

          {/* Barra de progresso */}
          <div className="mt-3 flex items-center space-x-2">
            <Progress value={progress} className="w-full h-2 bg-gray-300" />
            <span className="text-xs font-bold text-blue-700">{progress}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Editar Projeto</DialogTitle>
          </DialogHeader>

          <input
            type="text"
            name="title"
            value={projectData.projeto_proj_nome}
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-lg font-bold"
          />

          <textarea
            name="description"
            value={projectData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            rows={3}
          />

          <div className="flex justify-between text-sm text-gray-500">
            <div>
              <label>Início:</label>
              <input
                type="date"
                name="startDate"
                value={projectData.startDate}
                onChange={handleChange}
                className="border p-1 rounded-md"
              />
            </div>
            <div>
              <label>Fim:</label>
              <input
                type="date"
                name="endDate"
                value={projectData.endDate}
                onChange={handleChange}
                className="border p-1 rounded-md"
              />
            </div>
          </div>

          <Button
            className="w-full bg-blue-500 text-white rounded-md p-2 mt-4"
            onClick={handleSave}
          >
            Salvar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal de Exclusão */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Tem certeza que deseja excluir o projeto?</DialogTitle>
          </DialogHeader>

          <div className="flex justify-between mt-4">
            <Button
              className=" bg-red-500 text-white rounded-md p-5"
              onClick={handleDelete}
            >
              Excluir
            </Button>
            <Button
              className=" bg-gray-500 text-white rounded-md p-5"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
