import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash, MoreVertical, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import Popup from "@/components/Feedback/popup";
import axios from "axios";

interface CardProps {
  id: number;
  projeto_proj_nome: React.ReactNode | string;
  description: string;
  startDate: string;
  endDate?: string;
  progress: number; 
  users?: any[]; 
  onDelete: (id: number) => void;
  fetchProjectData?: (id: number) => void;
  onNotify?: (message: string, success: boolean) => void; // Add this prop
  className?: string;
  proj_valor_total: React.ReactNode | number;

}

type ReactElementWithProps = React.ReactElement & {
  props: {
    children?: React.ReactNode;
    [key: string]: any;
  };
};

export default function Cards_Projects({
  id,
  projeto_proj_nome,
  description,
  startDate,
  endDate = "",
  progress = 0,
  users = [],
  proj_valor_total = 0,
  onDelete,
  fetchProjectData,
  onNotify, // Add this to parameters
  className = "",
}: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  
  const extractProjectName = (): string => {
    if (typeof projeto_proj_nome === 'string') {
      return projeto_proj_nome;
    }
    
    if (React.isValidElement(projeto_proj_nome)) {
      const element = projeto_proj_nome as ReactElementWithProps;
      
      const linkChildren = element.props.children;
      
      if (typeof linkChildren === 'string') {
        return linkChildren;
      }
      
      if (React.isValidElement(linkChildren)) {
        const childElement = linkChildren as ReactElementWithProps;
        return String(childElement.props.children || '');
      }
      
      if (Array.isArray(linkChildren)) {
        const textContent = linkChildren.find(child => typeof child === 'string');
        return typeof textContent === 'string' ? textContent : '';
      }
    }
    
    return '';
  };

  const extractProjectValorToal = (): number => {
    if (typeof proj_valor_total === 'number') {
      return proj_valor_total;
    }
    
    if (React.isValidElement(proj_valor_total)) {
      const element = proj_valor_total as ReactElementWithProps;
      
      const linkChildren = element.props.children;
      
      if (typeof linkChildren === 'number') {
        return linkChildren;
      }
      
      if (React.isValidElement(linkChildren)) {
        const childElement = linkChildren as ReactElementWithProps;
        return Number(childElement.props.children || 0);
      }
      
      if (Array.isArray(linkChildren)) {
        const textContent = linkChildren.find(child => typeof child === 'number');
        return typeof textContent === 'number' ? textContent : 0;
      }
    }
    
    return 0;
  };
  
  
  const [projectData, setProjectData] = useState({
    projeto_proj_nome: extractProjectName(),
    description,
    startDate,
    endDate,
    proj_valor_total: extractProjectValorToal()
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const showNotification = (message: string, success: boolean) => {
    // If parent provided a notification function, use it
    if (onNotify) {
      onNotify(message, success);
      return;
    }
    
    // Otherwise use local notification
    setPopupMessage(message);
    setIsSuccess(success);
    setShowPopup(true);
    
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleSave = async () => {
    try {
 

      const updateData = {
        proj_nome: projectData.projeto_proj_nome,
        proj_descricao: projectData.description,
        proj_data_inicio: projectData.startDate,
        proj_data_fim: projectData.endDate,
        proj_valor_total: projectData.proj_valor_total
      };



      console.log(updateData)

      await axios.put(
        `http://localhost:3000/projeto/update/${id}`, 
        updateData
      );

      showNotification("Projeto atualizado com sucesso!", true);
      
      setIsModalOpen(false);
      
      if (typeof fetchProjectData === 'function') {
        fetchProjectData(id);
      }
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);

      let errorMessage = "Erro ao atualizar projeto";
      
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showNotification(errorMessage, false);
    }
  };

  const handleDelete = () => {
    onDelete(id);
    setIsDeleteModalOpen(false);
  };

  const formatDate = (dateStr: string) => { 
    try {
      // Primeiro tenta parsear sem adicionar hora
      const date = new Date(dateStr);
      
      // Se a data for inválida, tenta com o timezone
      if (isNaN(date.getTime())) {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');
      }
      
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Data inválida';
    }
  };

  return (
    <>
      {/* Only render the Popup if we're not using the parent's notification */}
      {!onNotify && (
        <Popup 
          isOpen={showPopup}
          message={popupMessage}
          isSuccess={isSuccess}
          onClose={() => setShowPopup(false)}
        />
      )}
    
      <Card className={`w-[300px] bg-gray-200 p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden relative cursor-pointer ${className}`}>
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
          <h2 className="text-base font-semibold text-gray-900 line-clamp-1">
            {projeto_proj_nome}
          </h2>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-10">{description}</p>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex -space-x-2">
              {users && users.length > 0 ? (
                <>
                  {users.slice(0, 4).map((user, index) => (
                    <Avatar key={index} className="w-8 h-8 border-2 border-white rounded-full ring-2 ring-white">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs">
                        {typeof user === 'string' ? user[0] : 'U'}
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

          <div className="mt-3 flex items-center space-x-2">
            <Progress value={progress} className="w-full h-2 bg-gray-300" />
            <span className="text-xs font-bold text-blue-700">{progress}%</span>
          </div>
          
          {(startDate || endDate) && (
            <div className="mt-2 flex gap-4 text-xs text-gray-500">
              {startDate && (
                <div>
                  Início: {formatDate(startDate)}
                </div>
              )}
              {endDate && (
                <div>
                  Conclusão: {formatDate(endDate)}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-8 bg-white rounded-xl shadow-lg max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">Editar Projeto</DialogTitle>
          </DialogHeader>

          <input
            type="text"
            name="projeto_proj_nome"
            value={projectData.projeto_proj_nome}
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-lg font-bold"
          />

          <textarea
            name="description"
            value={projectData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-md mt-4"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
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

          
          <input
            type="number"
            name="proj_valor_total"
            value={projectData.proj_valor_total}
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-lg font-bold"
          />




          <Button
            className="w-full bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] font-medium py-2 rounded cursor-pointer mt-4"
            onClick={() => handleSave()}
          >
            Salvar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-center mb-4">Tem certeza que deseja excluir o projeto?</DialogTitle>
          </DialogHeader>

          <div className="mt-2 pl-1">
            <div className="flex items-center text-sm text-red-700">
              <AlertTriangle size={16} className="mr-2" />
              <p>Todos os dados associados a este projeto serão removidos.</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-center">
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