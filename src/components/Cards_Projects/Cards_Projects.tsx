import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash, MoreVertical, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

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
      <Card className="w-[300px] bg-gray-200  p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden relative cursor-pointer">
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
          <h2 className="text-base font-semibold text-gray-900 line-clamp-1">{projectData.projeto_proj_nome}</h2>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-10">{projectData.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex -space-x-2">
              {users && users.length > 0 ? (
                <>
                  {users.slice(0, 4).map((user, index) => (
                    <Avatar key={index} className="w-8 h-8 border-2 border-white rounded-full ring-2 ring-white">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs">
                        {user[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {users.length > 4 && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 border-2 border-white text-xs font-medium text-gray-600">
                      +{users.length - 4}
                    </div>
                  )}
                </>
              ) : (
                <span className="text-xs text-gray-500">Nenhum usuário</span>
              )}
            </div>
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
        <DialogContent className="p-8 bg-white rounded-xl shadow-lg max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">Editar Projeto</DialogTitle>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início:</label>
              <Input
                type="date"
                name="startDate"
                value={projectData.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término:</label>
              <Input
                type="date"
                name="endDate"
                value={projectData.endDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <Button
            className="w-full bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] font-medium py-2 rounded cursor-pointer"
            onClick={handleSave}
          >
            Salvar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal de Exclusão */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="text-2xl font-bold tracking-tight text-center mb-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Tem certeza que deseja excluir o projeto?</DialogTitle>
          </DialogHeader>

          <div className="mt-3 pl-1">
            <div className="flex items-center text-sm text-red-700">
              <AlertTriangle size={16} className="mr-2" />
              <p>Todos os dados associados a este projeto serão removidos.</p>
            </div>
          </div>

          <div className="p-5 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-center">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white transition-all flex items-center gap-2 cursor-pointer"
              onClick={handleDelete}
            >
              <Trash size={16} />
              Excluir Projeto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
