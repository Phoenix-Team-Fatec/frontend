"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import "./ProjectRegistration.css"; // Importa o arquivo CSS separado
import axios from "axios";

export default function ProjectRegistration({
  open, 
  setOpen, 
  onProjectCreated
}: { 
  open: boolean; 
  setOpen: (value: boolean) => void; 
  onProjectCreated: (newProjectData: any) => void; // Função para notificar a criação do projeto com dados
}) {
  const [title, setTitle] = useState("");
  const [responsibles, setResponsibles] = useState<string[]>([]); 
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [availableUsers, setAvailableUsers] = useState<{ id: string; name: string }[]>([]);
  const [endDate, setEndDate] = useState("")

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

    const projectData = { title, responsibles, area, description };
    console.log("Enviando dados do projeto:", projectData);

    // Chama a função para adicionar o novo projeto
    onProjectCreated(projectData); 

    setOpen(false); // Fecha o modal após a criação
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="modal-container">
        <DialogHeader>
          <DialogTitle className="modal-title">Cadastro de projeto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="modal-form">
          <div>
            <label className="modal-label">Título</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {/* <div>
            <label className="modal-label">Responsáveis</label>
            <select multiple value={responsibles} onChange={handleResponsibleChange} className="dropdown">
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div> */}

          {/* <div>
            <label className="modal-label">Área de atuação</label>
            <Input value={area} onChange={(e) => setArea(e.target.value)} required />
          </div> */}

          <div>
            <label className="modal-label">Descrição</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
{/* 
          <div>
            <label className="modal-label">Data fim do projeto (dd/mm/yyyy)</label>
            <Textarea value={endDate} onChange={(e) => setEndDate(e.target.value)}  />
          </div> */}

          <DialogFooter className="modal-footer">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="submit-button">Cadastrar projeto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
