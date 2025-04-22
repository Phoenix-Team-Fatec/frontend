import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash, MoreVertical, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import Popup from "@/components/Feedback/popup";
import axios from "axios";

// Tipos de propriedades do componente
interface CardProps {
  id: number; // ID do projeto
  projeto_proj_nome: React.ReactNode | string; // Nome do projetO
  description: string; // Descrição do projeto
  startDate: string; // Data de início
  endDate?: string; // Data de término 
  progress: number; // Progresso (0-100)
  users?: any[]; // Lista de usuários associados
  onDelete: (id: number) => void; // Callback para exclusão
  fetchProjectData?: (id: number) => void; // Callback para atualizar dados 
  onNotify?: (message: string, success: boolean) => void; // Callback para notificações 
  className?: string; // Classes CSS adicionais 
}

// Tipo auxiliar para elementos React com props
type ReactElementWithProps = React.ReactElement & {
  props: {
    children?: React.ReactNode;
    [key: string]: any;
  };
};

/**
 * Componente Cards_Projects - Card de projeto individual com funcionalidades de edição e exclusão
 */
export default function Cards_Projects({
  id,
  projeto_proj_nome,
  description,
  startDate,
  endDate = "",
  progress = 0,
  users = [],
  onDelete,
  fetchProjectData,
  onNotify,
  className = "",
}: CardProps) {
  // Estados do componente
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla modal de edição
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controla modal de exclusão
  const [showPopup, setShowPopup] = useState(false); // Controla exibição de notificação local
  const [popupMessage, setPopupMessage] = useState(""); // Mensagem da notificação
  const [isSuccess, setIsSuccess] = useState(true); // Status da notificação (sucesso/erro)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Estado para dados editáveis do projeto
  const [projectData, setProjectData] = useState({
    projeto_proj_nome: "",
    description,
    startDate,
    endDate,
  });

  // Efeito para extrair o nome do projeto quando o componente monta
  useEffect(() => {
    setProjectData(prev => ({
      ...prev,
      projeto_proj_nome: extractProjectName()
    }));
  }, [projeto_proj_nome]);

  /**
   * Extrai o nome do projeto do prop projeto_proj_nome
   * @returns Nome do projeto como string
   */
  const extractProjectName = (): string => {
    // Se já for string, retorna direto
    if (typeof projeto_proj_nome === 'string') {
      return projeto_proj_nome;
    }
    
    // Se for elemento React, extrai o conteúdo
    if (React.isValidElement(projeto_proj_nome)) {
      const element = projeto_proj_nome as ReactElementWithProps;
      const linkChildren = element.props.children;
      
      // Verifica diferentes formatos de children
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
    
    return ''; // Fallback para caso não encontre
  };

  /**
   * Manipulador de mudanças nos campos editáveis
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  /**
   * Exibe notificação - usa callback do pai se disponível, senão usa notificação local
   */
  const showNotification = (message: string, success: boolean) => {
    if (onNotify) {
      onNotify(message, success);
      return;
    }
    
    setPopupMessage(message);
    setIsSuccess(success);
    setShowPopup(true);
    
    setTimeout(() => setShowPopup(false), 3000);
  };

  /**
   * Salva as alterações do projeto na API
   */
  const handleSave = async () => {
    try {
      // Formata datas para o formato esperado pela API
      const formattedStartDate = projectData.startDate 
        ? new Date(projectData.startDate + 'T12:00:00').toISOString().split('T')[0]
        : '';
      
      const formattedEndDate = projectData.endDate 
        ? new Date(projectData.endDate + 'T12:00:00').toISOString().split('T')[0]
        : '';

      // Dados para atualização
      const updateData = {
        proj_nome: projectData.projeto_proj_nome,
        proj_descricao: projectData.description,
        proj_data_inicio: formattedStartDate,
        proj_data_fim: formattedEndDate
      };

      // Chamada API para atualizar projeto
      await axios.put(
        `http://localhost:3000/projeto/update/${id}`, 
        updateData
      );

      showNotification("Projeto atualizado com sucesso!", true);
      setIsModalOpen(false);
      
      // Atualiza dados do projeto se callback estiver disponível
      if (typeof fetchProjectData === 'function') {
        fetchProjectData(id);
      }
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);

      // Tratamento de erros da API
      let errorMessage = "Erro ao atualizar projeto";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showNotification(errorMessage, false);
    }
  };

  /**
   * Confirma e executa a exclusão do projeto
   */
  const handleDelete = () => {
    onDelete(id);
    setIsDeleteModalOpen(false);
  };

  /**
   * Formata datas para exibição amigável
   */
  const formatDate = (dateStr: string) => { 
    try {
      const date = new Date(dateStr);
      
      // Fallback para datas inválidas
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
      {/* Notificação local (apenas se não houver callback do pai) */}
      {!onNotify && (
        <Popup 
          isOpen={showPopup}
          message={popupMessage}
          isSuccess={isSuccess}
          onClose={() => setShowPopup(false)}
        />
      )}
    
      {/* Card do Projeto */}
      <Card className={`w-[300px] bg-gray-200 p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden relative cursor-pointer ${className}`}>
        {/* Ícones de ações (editar, excluir, menu) */}
        <div className="absolute top-2 right-2 flex space-x-2 text-gray-600">
  {/* Ícone de Edição */}
  <Pencil
    size={16}
    className="cursor-pointer hover:text-black"
    onClick={() => setIsModalOpen(true)}
    aria-label="Editar projeto"
  />
  
  {/* Ícone de Exclusão */}
  <Trash
    size={16}
    className="cursor-pointer hover:text-red-500"
    onClick={() => setIsDeleteModalOpen(true)}
    aria-label="Excluir projeto"
  />
  
  {/* Ícone de Detalhes (3 pontinhos) */}
  <MoreVertical 
    size={16} 
    className="cursor-pointer hover:text-blue-600"
    onClick={() => setIsDetailsModalOpen(true)}
    aria-label="Ver detalhes do projeto"
  />
</div>

<Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
  <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold">
        Detalhes do Projeto: {projectData.projeto_proj_nome}
      </DialogTitle>
    </DialogHeader>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {/* Coluna 1 - Informações básicas */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Descrição:</h3>
          <p className="mt-1 text-gray-600">{description || "Não informada"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Progresso:</h3>
          <div className="flex items-center gap-3 mt-2">
            <Progress value={progress} className="w-full h-2" />
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Coluna 2 - Datas e Membros */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">Início:</h3>
            <p className="mt-1 text-gray-600">{formatDate(startDate)}</p>
          </div>
          {endDate && (
            <div>
              <h3 className="font-semibold text-gray-700">Término:</h3>
              <p className="mt-1 text-gray-600">{formatDate(endDate)}</p>
            </div>
          )}
        </div>

        {users && users.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700">Membros ({users.length}):</h3>
            <ul className="mt-2 space-y-2">
              {users.map((user, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                      {typeof user === 'object' ? user.user_nome?.[0]?.toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">
                    {typeof user === 'object' ? user.user_nome : user}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

    <div className="mt-6 flex justify-end">
      <Button 
        onClick={() => setIsDetailsModalOpen(false)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Fechar
      </Button>
    </div>
  </DialogContent>
</Dialog>

        <CardContent className="p-0">
          {/* Nome do projeto */}
          <h2 className="text-base font-semibold text-gray-900 line-clamp-1">
            {projeto_proj_nome}
          </h2>
          
          {/* Descrição */}
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-10">
            {description}
          </p>
          
          {/* Lista de usuários (avatars) */}
          <div className="flex justify-between items-center mt-3">
            <div className="flex -space-x-2">
              {users && users.length > 0 ? (
                <>
                  {users.slice(0, 4).map((user, index) => (
                    <Avatar 
                      key={index} 
                      className="w-8 h-8 border-2 border-white rounded-full ring-2 ring-white"
                    >
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

          {/* Barra de progresso */}
          <div className="mt-3 flex items-center space-x-2">
            <Progress value={progress} className="w-full h-2 bg-gray-300" />
            <span className="text-xs font-bold text-blue-700">{progress}%</span>
          </div>
          
          {/* Datas do projeto */}
          {(startDate || endDate) && (
            <div className="mt-2 flex gap-4 text-xs text-gray-500">
              {startDate && (
                <div>Início: {formatDate(startDate)}</div>
              )}
              {endDate && (
                <div>Conclusão: {formatDate(endDate)}</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-8 bg-white rounded-xl shadow-lg max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-center mb-6">
              Editar Projeto
            </DialogTitle>
          </DialogHeader>

          {/* Campos editáveis */}
          <input
            type="text"
            name="projeto_proj_nome"
            value={projectData.projeto_proj_nome}
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-lg font-bold"
            placeholder="Nome do projeto"
          />

          <textarea
            name="description"
            value={projectData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-md mt-4"
            rows={3}
            placeholder="Descrição do projeto"
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início:
              </label>
              <Input
                type="date"
                name="startDate"
                value={projectData.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Término:
              </label>
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
            className="w-full bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] font-medium py-2 rounded cursor-pointer mt-4"
            onClick={handleSave}
          >
            Salvar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-center mb-4">
              Tem certeza que deseja excluir o projeto?
            </DialogTitle>
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