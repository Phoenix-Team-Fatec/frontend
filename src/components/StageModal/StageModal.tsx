import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./stageModal.css";

interface StageModalProps {
  onClose: () => void;
  onSave: (stageName: string) => void;
}

const StageModal: React.FC<StageModalProps> = ({ onClose, onSave }) => {
  const [stageName, setStageName] = useState("");

  const handleSave = () => {
    if (stageName.trim()) {
      onSave(stageName);
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="modal-content">
        <h2>Adicionar Etapa</h2>
        <Input placeholder="Nome da etapa" value={stageName} onChange={(e) => setStageName(e.target.value)} />
        <Button onClick={handleSave}>Salvar</Button>
      </DialogContent>
    </Dialog>
  );
};

export default StageModal;
