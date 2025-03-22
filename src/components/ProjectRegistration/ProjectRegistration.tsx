"use client";
import { useState, useEffect, ChangeEvent } from "react";

// Importação dos componentes do shadcn/ui para a interface do modal
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import "./ProjectRegistration.css"; // Importa o arquivo CSS separado

// Componente que exibe um modal para cadastrar um novo projeto
export default function ProjectRegistration({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  // Estados para armazenar os dados do formulário
  const [title, setTitle] = useState("");
  const [responsibles, setResponsibles] = useState<string[]>([]);
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [availableUsers, setAvailableUsers] = useState<{ id: string; name: string }[]>([]);

  // Busca dos usuários do backend quando carregar o componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Simulação de requisição ao backend
        // const response = await fetch('/api/users');
        // const data = await response.json();
        // setAvailableUsers(data);

        // Dados simulados pra testar o componente
        const simulatedData = [
          { id: "1", name: "Gustavo" },
          { id: "2", name: "Samuel" },
          { id: "3", name: "Matheuz" },
        ];
        setAvailableUsers(simulatedData);
      } catch (error) {
        console.error("Erro ao buscar usuários", error);
      }
    };

    fetchUsers();
  }, []);

  // Atualiza os responsáveis ao selecionar no dropdown
  const handleResponsibleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setResponsibles(selectedOptions);
  };

  // Envia os dados do formulário para o backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const projectData = { title, responsibles, area, description };
    console.log("Enviando dados do projeto:", projectData);

    // Exemplo de envio para o backend:
    // await fetch('/api/projects', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(projectData),
    // });

    setOpen(false); // Fecha o modal após o envio
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

          <div>
            <label className="modal-label">Responsáveis</label>
            <select multiple value={responsibles} onChange={handleResponsibleChange} className="dropdown">
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="modal-label">Área de atuação</label>
            <Input value={area} onChange={(e) => setArea(e.target.value)} required />
          </div>

          <div>
            <label className="modal-label">Descrição</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <DialogFooter className="modal-footer">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="submit-button">Cadastrar projeto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
