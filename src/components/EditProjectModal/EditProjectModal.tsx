import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    area: string;
    startDate: string;
    endDate: string;
  };
  onSave: (updatedProject: any) => void;
}

export default function EditProjectModal({ isOpen, onClose, project, onSave }: EditProjectModalProps) {
  const [editedProject, setEditedProject] = useState(project);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedProject({ ...editedProject, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-md p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Mais informações</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Título do Projeto */}
          <input 
            type="text"
            name="title"
            value={editedProject.title}
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-lg font-bold"
          />

          {/* Área de Atuação */}
          <input 
            type="text"
            name="area"
            value={editedProject.area}
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-sm text-blue-500"
          />

          {/* Descrição */}
          <textarea 
            name="description"
            value={editedProject.description}
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
                value={editedProject.startDate}
                onChange={handleChange}
                className="border p-1 rounded-md ml-2"
              />
            </div>
            <div>
              <label>Fim:</label>
              <input 
                type="date" 
                name="endDate"
                value={editedProject.endDate}
                onChange={handleChange}
                className="border p-1 rounded-md ml-2"
              />
            </div>
          </div>

          {/* Botão de Salvar */}
          <Button 
            className="w-full bg-blue-500 text-white rounded-md p-2 mt-4"
            onClick={() => onSave(editedProject)}
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}