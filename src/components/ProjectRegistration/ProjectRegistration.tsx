"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import axios from "axios";
import AreaSelectionWithManagement from "../AreaSelection/AreaSelectionWithManagement";

export default function ProjectRegistration({
  open, 
  setOpen, 
  onProjectCreated
}: { 
  open: boolean; 
  setOpen: (value: boolean) => void; 
  onProjectCreated: (newProjectData: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [responsibles, setResponsibles] = useState<string[]>([]); 
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [availableUsers, setAvailableUsers] = useState<{ id: string; name: string }[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/usuarios");

        const formattedUsuario = data.map((user: any) => ({
          id: user.user_id.toString(),
          name: `${user.user_nome} ${user.user_sobrenome ?? ""}`.trim(),
        }));

        setAvailableUsers(formattedUsuario);
      } catch (error) {
        console.error("Erro ao carregar usuários", error);
      }
    };
    fetchUsers();
  }, []);

  const handleResponsibleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setResponsibles(selectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const projectData = { title, responsibles, area, description, startDate, endDate };
    console.log("Enviando dados do projeto:", projectData);

    onProjectCreated(projectData); 

    setOpen(false); 
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-8 bg-white rounded-xl shadow-lg max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold tracking-tighter text-center space-y-2">Cadastro de projeto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Responsáveis</label>
            <select
              multiple
              value={responsibles}
              onChange={handleResponsibleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <AreaSelectionWithManagement 
            selectedArea={area}
            onAreaChange={setArea}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <div>
              <label>Início:</label>
              <input 
                type="date" 
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-1 rounded-md"
              />
            </div>
            <div>
              <label>Fim:</label>
              <input 
                type="date" 
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-1 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-2 w-full">
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="flex-1 text-[#355EAF] border border-[#355EAF] hover:text-[#2d4f95] cursor-pointer"
              type="button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] cursor-pointer"
            >
              Cadastrar projeto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}