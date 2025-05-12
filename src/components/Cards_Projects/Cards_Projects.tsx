import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash, MoreVertical, AlertTriangle, Folder, Badge, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Trash2, Check } from "lucide-react";
import Popup from "@/components/Feedback/popup";
import axios from "axios";

interface CardProps {
  id: number;
  projeto_proj_nome: React.ReactNode | string;
  description: string;
  startDate: string;
  endDate?: string;
  progress: any; 
  users?: any[]; 
  onDelete: (id: number) => void;
  fetchProjectData?: (id: number) => void;
  onNotify?: (message: string, success: boolean) => void; // Add this prop
  className?: string;
  proj_valor_total: React.ReactNode | number;
  proj_inst_parceiras: string[];
  proj_inst_financiadoras: string[];
  proj_area_atuacao_id:number
}

type ReactElementWithProps = React.ReactElement & {
  props: {
    children?: React.ReactNode;
    [key: string]: any;
  };
};

interface Area_atuacao{
  area_atuacao_id: number,
  area_atuacao_nome:string
}

export default function Cards_Projects({
  id,
  projeto_proj_nome,
  description,
  startDate,
  endDate = "",
  progress = 0,
  users = [],
  proj_valor_total = 0,
  proj_inst_financiadoras = [],
  proj_inst_parceiras = [],
  proj_area_atuacao_id = 0,
  onDelete,
  fetchProjectData,
  onNotify, // Add this to parameters
  className = "",
}: CardProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [areasList, setAreasList] = useState<Area_atuacao[]>([]);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [storedAreas, setStoredAreas] = useState<Area_atuacao[]>([]);


 

  
  
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
  
  useEffect(() => {
    const fetchAreaAtuacao = async () => {
      try{


        const {data} = await axios.get("http://localhost:3000/area_atuacao")

        
        
        setAreasList(data)
        setStoredAreas(data)
      
      }catch(error){
        console.log(error)
      }
    }

    fetchAreaAtuacao()
  },[])

  
  
      const toggleAreaSelection = (area: number) => {
        setSelectedArea(area)
      };
  
  

  
  const [projectData, setProjectData] = useState({
    projeto_proj_nome: extractProjectName(),
    description,
    startDate,
    endDate,
    proj_valor_total: extractProjectValorToal(),
    proj_inst_parceiras,
    proj_inst_financiadoras,
    proj_area_atuacao_id
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
        proj_valor_total: projectData.proj_valor_total,
        proj_inst_parceiras: projectData.proj_inst_parceiras,
        proj_inst_financiadoras: projectData.proj_inst_financiadoras,
        area_atuacao_id: selectedArea 
      };



      console.log(updateData)

      await axios.put(
        `http://localhost:3000/projeto/update/${id}`, 
        updateData
      );

      window.location.reload();
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

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'proj_inst_parceiras' | 'proj_inst_financiadoras') => {
    const updatedArray = [...projectData[field]];
    updatedArray[index] = e.target.value;
    setProjectData({ ...projectData, [field]: updatedArray });
  };
  
  const addArrayField = (field: 'proj_inst_parceiras' | 'proj_inst_financiadoras') => {
    setProjectData({ ...projectData, [field]: [...projectData[field], ''] });
  };
  
  const removeArrayField = (index: number, field: 'proj_inst_parceiras' | 'proj_inst_financiadoras') => {
    const updatedArray = [...projectData[field]];
    updatedArray.splice(index, 1);
    setProjectData({ ...projectData, [field]: updatedArray });
  };


  const formatDateForInput = (dateStr: string) => {
    try {
      // Se a data já estiver no formato yyyy-MM-dd, retorna diretamente
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      
      // Tenta parsear a data de diferentes formas
      let date = new Date(dateStr);
      
      // Se falhar, tenta adicionando o timezone
      if (isNaN(date.getTime())) {
        date = new Date(dateStr + 'T00:00:00');
      }
      
      // Se ainda falhar, retorna string vazia
      if (isNaN(date.getTime())) {
        return '';
      }
      
      // Formata para yyyy-MM-dd
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error('Error formatting date for input:', e);
      return '';
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
          <MoreVertical 
            size={16} 
            className="cursor-pointer hover:text-gray-800"
            onClick={() => setIsDetailsModalOpen(true)}
          />

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
                value={formatDateForInput(projectData.startDate)}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término:</label>
              <Input
                type="date"
                name="endDate"
                value={formatDateForInput(projectData.endDate)}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Instituições Parceiras:</label>
  {projectData.proj_inst_parceiras.map((parceira, index) => (
    <div key={index} className="flex items-center gap-2 mb-2">
      <input
        type="text"
        value={parceira}
        onChange={(e) => handleArrayChange(e, index, 'proj_inst_parceiras')}
        className="flex-1 border p-2 rounded-md"
      />
      <Button
        type="button"
        onClick={() => removeArrayField(index, 'proj_inst_parceiras')}
        className="bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded"
      >
        Remover
      </Button>
    </div>
  ))}
  <Button
    type="button"
    onClick={() => addArrayField('proj_inst_parceiras')}
    className="text-sm bg-gray-200 px-2 py-1 rounded"
  >
    + Adicionar parceira
  </Button>
</div>

<div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Instituições Financiadoras:</label>
  {projectData.proj_inst_financiadoras.map((financiadora, index) => (
    <div key={index} className="flex items-center gap-2 mb-2">
      <input
        type="text"
        value={financiadora}
        onChange={(e) => handleArrayChange(e, index, 'proj_inst_financiadoras')}
        className="flex-1 border p-2 rounded-md"
      />
      <Button
        type="button"
        onClick={() => removeArrayField(index, 'proj_inst_financiadoras')}
        className="bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded"
      >
        Remover
      </Button>
    </div>
  ))}
  <Button
    type="button"
    onClick={() => addArrayField('proj_inst_financiadoras')}
    className="text-sm bg-gray-200 px-2 py-1 rounded"
  >
    + Adicionar financiadora
  </Button>
</div>


          
          <input
            type="number"
            name="proj_valor_total"
            value={projectData.proj_valor_total}
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-lg font-bold"
          />


       
            <div className="space-y-2">
              <Label>Áreas disponíveis</Label>
              <div className="flex flex-wrap gap-2">
                {storedAreas.map((area) => (
                  <div
                    key={`stored-${area.area_atuacao_id}`}
                    onClick={() => toggleAreaSelection(area.area_atuacao_id)}
                    className={`px-3 py-1 rounded-full cursor-pointer flex items-center space-x-1 border ${
                      (selectedArea ?? projectData.proj_area_atuacao_id) === area.area_atuacao_id
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {(selectedArea ?? projectData.proj_area_atuacao_id) === area.area_atuacao_id && <Check size={14} className="text-green-600" />}
                    <span>{area.area_atuacao_nome}</span>
                  </div>
                ))}
              </div>
           </div>

         
          <Button
            className="w-full bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] font-medium py-2 rounded cursor-pointer mt-4"
            onClick={() => handleSave()}
          >
            Salvar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
  <DialogContent className="max-w-2xl rounded-lg">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Folder className="text-blue-600" size={20} />
        Detalhes do Projeto
      </DialogTitle>
      <DialogDescription className="text-gray-500">
        Informações completas sobre o projeto
      </DialogDescription>
    </DialogHeader>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
      {/* Seção de Informações Básicas */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Nome do Projeto</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900">{projeto_proj_nome}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Área de atuação:</h3>
          <p className="mt-1 text-gray-700 whitespace-pre-line">
            {areasList.find(area => area.area_atuacao_id === proj_area_atuacao_id)?.area_atuacao_nome || 'Nenhuma área definida'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
          <p className="mt-1 text-gray-700 whitespace-pre-line">
            {description || 'Nenhuma descrição fornecida'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Progresso</h3>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={progress} className="h-2 w-full" />
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Instituições Parceiras:</h3>
          <p className="mt-1 text-gray-700 whitespace-pre-line">
          {proj_inst_parceiras.length > 0 ? proj_inst_parceiras.join(', ') : 'Nenhuma instituição parceira associada'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Instituições Financiadoras:</h3>
          <p className="mt-1 text-gray-700 whitespace-pre-line">
          {proj_inst_financiadoras.length > 0 ? proj_inst_financiadoras.join(', ') : 'Nenhuma instituição  financiadora associada'}
          </p>
        </div>
      </div>

      {/* Seção de Metadados */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Data de Início</h3>
            <p className="mt-1 text-gray-700">
              {startDate ? formatDate(startDate) : 'Não definida'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Data de Término</h3>
            <p className="mt-1 text-gray-700">
              {endDate ? formatDate(endDate) : 'Não definida'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
          <p className="mt-1 text-xl font-semibold text-green-600">
            {proj_valor_total ? `R$ ${Number(proj_valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Não informado'}
          </p>
        </div>
      </div>

      
    </div>

    <DialogFooter className="border-t pt-4">
      <Button 
        variant="outline" 
        onClick={() => setIsDetailsModalOpen(false)}
        className="mr-2"
      >
        Fechar
      </Button>
      <Button 
        onClick={() => {
          setIsDetailsModalOpen(false);
          setIsModalOpen(true);
        }}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Editar Projeto
      </Button>
    </DialogFooter>
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