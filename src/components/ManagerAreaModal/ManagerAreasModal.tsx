"use client";
import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Check, X, Search } from "lucide-react";

interface AreaAtuacao {
  area_atuacao_id?: number;
  area_atuacao_nome: string;
}

interface ManageAreasModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  areas: AreaAtuacao[];
  onAreasChange: (areas: AreaAtuacao[]) => void;
}

export default function ManageAreasModal({
  open,
  setOpen,
  areas,
  onAreasChange
}: ManageAreasModalProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleStartEdit = (area: AreaAtuacao) => {
    if (area.area_atuacao_id) {
      setEditingId(area.area_atuacao_id);
      setEditingName(area.area_atuacao_nome);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim()) return;

    try {
      const { data } = await axios.put(`http://localhost:3000/area_atuacao`, {
        area_atuacao_id: editingId,
        area_atuacao_nome: editingName.trim()
      });

      onAreasChange(
        areas.map(area => 
          area.area_atuacao_id === editingId 
            ? { ...area, area_atuacao_nome: editingName.trim() } 
            : area
        )
      );
      
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      console.error("Erro ao editar área de atuação", error);
      alert("Erro ao editar área de atuação");
    }
  };

  const handleDeleteArea = async (areaId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta área?")) return;
    
    try {
      await axios.delete(`http://localhost:3000/area_atuacao/${areaId}`);
      
      onAreasChange(areas.filter(area => area.area_atuacao_id !== areaId));
    } catch (error) {
      console.error("Erro ao excluir área de atuação", error);
      alert("Erro ao excluir área de atuação");
    }
  };

  const filteredAreas = areas.filter(area => 
    area.area_atuacao_nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-6 bg-white rounded-xl shadow-xl max-w-md w-[90vw] border-0">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-xl font-bold text-[#355EAF] justify-center items-center">
            Gerenciar Áreas de Atuação
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="relative mb-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar áreas..."
              className="pl-9 bg-gray-50 border-gray-200"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto pr-1">
            {filteredAreas.length > 0 ? (
              <ul className="space-y-2">
                {filteredAreas.map((areaObj) => (
                  <li 
                    key={areaObj.area_atuacao_id || Math.random()}
                    className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm transition-all duration-200"
                  >
                    {editingId === areaObj.area_atuacao_id ? (
                      <div className="flex items-center justify-between w-full">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="mr-2 flex-grow border-[#355EAF] focus:ring-2 focus:ring-[#355EAF]"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSaveEdit();
                            } else if (e.key === "Escape") {
                              handleCancelEdit();
                            }
                          }}
                        />
                        <div className="flex space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleSaveEdit}
                            className="text-green-500 hover:text-green-700 hover:bg-green-50 transition-colors"
                          >
                            <Check size={18} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <X size={18} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="font-medium text-gray-700">{areaObj.area_atuacao_nome}</span>
                        <div className="flex space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(areaObj)}
                            className="text-[#355EAF] hover:text-[#1e3b7e] hover:bg-blue-50 rounded-full h-8 w-8 p-0 flex items-center justify-center transition-colors"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => areaObj.area_atuacao_id && handleDeleteArea(areaObj.area_atuacao_id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full h-8 w-8 p-0 flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-500">
                  {searchTerm ? "Nenhuma área encontrada" : "Nenhuma área cadastrada"}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] transition-colors"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}