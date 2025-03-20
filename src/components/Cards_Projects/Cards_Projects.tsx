import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CardProps {
  id: number;
}

export default function CardItem({ id }: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // Estado para o modal de exclusão
  const [projectData, setProjectData] = useState({
    title: "Título do projeto",
    description: "Texto genérico de descrição",
    startDate: "2025-03-13",
    endDate: "2025-03-30",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    // Lógica para excluir o projeto
    console.log(`Projeto ${id} excluído.`);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Card className="w-[300px] h-[130px] bg-gray-200 p-4 rounded-lg shadow-md relative">
        {/* Ícones de ações */}
        <div className="absolute top-2 right-2 flex space-x-2 text-gray-600">
          <Pencil 
            size={16} 
            className="cursor-pointer hover:text-black" 
            onClick={() => setIsModalOpen(true)}
          />
          <Trash 
            size={16} 
            className="cursor-pointer hover:text-red-500" 
            onClick={() => setIsDeleteModalOpen(true)}  // Abre o modal de confirmação de exclusão
          />
          <MoreVertical size={16} className="cursor-pointer" />
        </div>

        <CardContent className="p-0">
          {/* Título */}
          <h2 className="text-sm font-bold text-gray-900">{projectData.title}</h2>
          <p className="text-xs text-gray-500">{projectData.description}</p>

          {/* Avatares sobrepostos */}
          <div className="flex items-center mt-2 space-x-[-8px]">
            <Avatar className="w-6 h-6 border border-white">
              <AvatarFallback className="bg-purple-600 text-white text-xs">A</AvatarFallback>
            </Avatar>
            <Avatar className="w-6 h-6 border border-white">
              <AvatarFallback className="bg-black text-white text-xs">B</AvatarFallback>
            </Avatar>
            <Avatar className="w-6 h-6 border border-white">
              <AvatarFallback className="bg-[#8b5e3c] text-white text-xs">C</AvatarFallback>
            </Avatar>
            <Avatar className="w-6 h-6 bg-white text-xs border border-gray-300">
              +13
            </Avatar>
          </div>

          {/* Barra de progresso */}
          <div className="mt-3 flex items-center space-x-2">
            <Progress value={32} className="w-full h-2 bg-gray-300" /> {/* Valor da barra de progresso pra integrar depois */}
            <span className="text-xs font-bold text-blue-700">32%</span> {/* Valor da barra de progresso pra integrar depois que é mostrado para o usuario */}
          </div>
        </CardContent>
      </Card>

      {/* MODAL DE EDIÇÃO */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Editar Projeto</DialogTitle>
          </DialogHeader>

          {/* Título do Projeto */}
          <input 
            type="text"
            name="title"
            value={projectData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-lg font-bold"
          />

          {/* Descrição */}
          <textarea 
            name="description"
            value={projectData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            rows={3}
          />

          {/* Datas de Início e Fim */}
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

          {/* Botão de Salvar */}
          <Button 
            className="w-full bg-blue-500 text-white rounded-md p-2 mt-4"
            onClick={() => setIsModalOpen(false)}
          >
            Salvar
          </Button>
        </DialogContent>
      </Dialog>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Tem certeza que deseja excluir o projeto?</DialogTitle>
          </DialogHeader>

          <div className="flex justify-between mt-4">
            <Button 
              className=" bg-red-500 text-white rounded-md p-5"
              onClick={handleDelete}  // Chama a função para excluir o projeto
            >
              Excluir
            </Button>
            <Button 
              className=" bg-gray-500 text-white rounded-md p-5"
              onClick={() => setIsDeleteModalOpen(false)}  // Fecha o modal sem excluir
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
