
"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditStageModalProps {
  stage: {
    etapa_id: number;
    etapa_nome: string;
    etapa_descricao?: string;
  };
  onSave: (stageId: number, newName: string, newDescription: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditStageModal({ 
  stage, 
  onSave, 
  isOpen,
  onOpenChange
}: EditStageModalProps) {
  const [name, setName] = React.useState(stage.etapa_nome);
  const [description, setDescription] = React.useState(stage.etapa_descricao || "");

  // Atualiza os estados quando o stage prop muda
  useEffect(() => {
    setName(stage.etapa_nome);
    setDescription(stage.etapa_descricao || "");
  }, [stage, isOpen]); // Adicionamos isOpen como dependência

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(stage.etapa_id, name, description);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Etapa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="stage-name">Nome da Etapa</Label>
            <Input
              id="stage-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="stage-description">Descrição (Opcional)</Label>
            <Textarea
              id="stage-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#355EAF] hover:bg-[#2d4f95]">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}