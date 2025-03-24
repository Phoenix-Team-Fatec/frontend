import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./taskModal.css";

interface TaskModalProps {
  stageId: number;
  onClose: () => void;
  onSave: (stageId: number, task: { name: string; description: string; assigned: string }) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ stageId, onClose, onSave }) => {
  const [task, setTask] = useState({ name: "", description: "", assigned: "" });

  const handleSave = () => {
    if (task.name.trim()) {
      onSave(stageId, task);
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="modal-content">
        <h2>Adicionar Tarefa</h2>
        <Input placeholder="Nome da tarefa" value={task.name} onChange={(e) => setTask({ ...task, name: e.target.value })} />
        <Input placeholder="Descrição" value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} />
        <Input placeholder="Responsável" value={task.assigned} onChange={(e) => setTask({ ...task, assigned: e.target.value })} />
        <Button onClick={handleSave}>Salvar</Button>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
