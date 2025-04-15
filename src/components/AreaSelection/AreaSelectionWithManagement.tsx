"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Area {
    area_atuacao_id: string;
    area_atuacao_nome: string;
}

interface AreaSelectionProps {
    selectedArea: string;
    onAreaChange: (value: string) => void;
}

export default function AreaSelectionWithManagement({ selectedArea, onAreaChange }: AreaSelectionProps) {
    const [areas, setAreas] = useState<Area[]>([]);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newAreaName, setNewAreaName] = useState("");
    const [currentArea, setCurrentArea] = useState<Area | null>(null);

    useEffect(() => {
        fetchAreas();
    }, []);

    // Function to fetch all areas
    const fetchAreas = async () => {
        try {
            const response = await axios.get("http://localhost:3000/area_atuacao");
            setAreas(response.data);
        } catch (error) {
            console.error("Error loading areas", error);
        }
    };

    // Create a new area
    const handleCreateArea = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Don't submit if name is empty
        if (!newAreaName.trim()) {
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/area_atuacao", {
                area_atuacao_nome: newAreaName
            });

            if (response.data && response.data.area_atuacao_id) {
                // Refresh the areas list
                await fetchAreas();

                // Select the newly created area
                onAreaChange(response.data.area_atuacao_id.toString());

                setNewAreaName("");
                setIsCreateModalOpen(false);
            }
        } catch (error) {
            console.error("Error creating area:", error);
        }
    };

    // Update an existing area
    const handleUpdateArea = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling to parent forms

        if (!currentArea || !newAreaName.trim()) return;

        try {
            const response = await axios.put("http://localhost:3000/area_atuacao", {
                area_atuacao_id: parseInt(currentArea.area_atuacao_id),
                area_atuacao_nome: newAreaName,
            });

            if (response.data) {
                // Refresh the areas list
                await fetchAreas();

                // If the updated area was selected, ensure it stays selected
                if (selectedArea === currentArea.area_atuacao_id) {
                    onAreaChange(response.data.area_atuacao_id.toString());
                }

                setIsEditModalOpen(false);
            }
        } catch (error) {
            console.error("Error updating area:", error);
        }
    };

    // Delete an area
    const handleDeleteArea = async (areaId: string) => {
        try {
            await axios.delete(`http://localhost:3000/area_atuacao/${areaId}`);

            // Remove the deleted area from the list
            setAreas(areas.filter(area => area.area_atuacao_id !== areaId));

            if (selectedArea === areaId) {
                onAreaChange("");
            }
        } catch (error) {
            console.error("Error deleting area:", error);
        }
    };

    const openEditModal = (area: Area) => {
        setCurrentArea(area);
        setNewAreaName(area.area_atuacao_nome);
        setIsEditModalOpen(true);
    };

    const openCreateModal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setNewAreaName("");
        setIsCreateModalOpen(true);
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="area" className="block text-sm font-medium text-gray-700">
                    Área de atuação
                </Label>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsManageModalOpen(true)}
                    className="text-[#355EAF] hover:text-[#2d4f95] text-xs cursor-pointer"
                >
                    Gerenciar áreas
                </Button>
            </div>

            <div className="flex gap-2">
                <select
                    id="area"
                    value={selectedArea}
                    onChange={(e) => onAreaChange(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                >
                    <option value="">Selecione uma área</option>
                    {areas.map((area) => (
                        <option key={area.area_atuacao_id} value={area.area_atuacao_id}>
                            {area.area_atuacao_nome}
                        </option>
                    ))}
                </select>

                <Button
                    type="button"
                    onClick={openCreateModal}
                    className="bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] cursor-pointer h-10 flex items-center justify-center"
                >
                    <Plus size={16} />
                </Button>
            </div>

            {/* Manage Areas Modal */}
            <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
                <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tighter text-center">
                            Gerenciar Áreas de Atuação
                        </DialogTitle>
                    </DialogHeader>

                    <div className="my-4">

                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nome
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {areas.length === 0 ? (
                                        <tr>
                                            <td colSpan={2} className="px-4 py-4 text-center text-sm text-gray-500">
                                                Nenhuma área cadastrada
                                            </td>
                                        </tr>
                                    ) : (
                                        areas.map((area) => (
                                            <tr key={area.area_atuacao_id}>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {area.area_atuacao_nome}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setIsManageModalOpen(false);
                                                            openEditModal(area);
                                                        }}
                                                        className="text-black mr-1 cursor-pointer"
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteArea(area.area_atuacao_id);
                                                        }}
                                                        className="text-black cursor-pointer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create Area Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tighter text-center">
                            Nova Área de Atuação
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateArea} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="areaName">Nome da Área</Label>
                            <Input
                                id="areaName"
                                value={newAreaName}
                                onChange={(e) => setNewAreaName(e.target.value)}
                                required
                                placeholder="Digite o nome da área"
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                variant="outline"
                                className="text-[#355EAF] border border-[#355EAF] hover:text-[#2d4f95] cursor-pointer"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] cursor-pointer"
                            >
                                Cadastrar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Area Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tighter text-center">
                            Editar Área de Atuação
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdateArea} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="editAreaName">Nome da Área</Label>
                            <Input
                                id="editAreaName"
                                value={newAreaName}
                                onChange={(e) => setNewAreaName(e.target.value)}
                                required
                                placeholder="Digite o nome da área"
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                variant="outline"
                                className="text-[#355EAF] border border-[#355EAF] hover:text-[#2d4f95] cursor-pointer"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] cursor-pointer"
                            >
                                Atualizar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}