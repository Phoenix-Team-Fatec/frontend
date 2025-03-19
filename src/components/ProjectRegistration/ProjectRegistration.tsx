"use client";

// Importa hooks do React para gerenciar estados e efeitos colaterais
import { useState, useEffect, ChangeEvent } from "react";

// Importa os componentes do shadcn/ui para construir o modal
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Definição do componente ProjectRegistration, que recebe duas props:
// `open` (booleano que indica se o modal está aberto) e
// `setOpen` (função para alterar o estado de abertura do modal)
export default function ProjectRegistration({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  
  // Estado para armazenar o título do projeto
  const [title, setTitle] = useState("");
  
  // Estado para armazenar os IDs dos usuários responsáveis selecionados
  const [responsibles, setResponsibles] = useState<string[]>([]);
  
  // Estado para armazenar a área de atuação do projeto
  const [area, setArea] = useState("");
  
  // Estado para armazenar a descrição do projeto
  const [description, setDescription] = useState("");
  
  // Estado para armazenar os usuários disponíveis (dados simulados ou vindos do backend)
  const [availableUsers, setAvailableUsers] = useState<{ id: string; name: string }[]>([]);

  // useEffect para simular a busca de usuários do backend
  useEffect(() => {
    // Função assíncrona para buscar os usuários disponíveis
    const fetchUsers = async () => {
      // Exemplo: requisição para o backend para obter usuários cadastrados
      // const response = await fetch('/api/users');
      // const data = await response.json();
      // setAvailableUsers(data);

      // Dados simulados para exemplificação
      const simulatedData = [
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
        { id: "3", name: "Charlie" },
      ];
      setAvailableUsers(simulatedData);
    };

    fetchUsers();
  }, []); // Executa uma única vez após o componente ser montado

  // Handler para atualizar os responsáveis quando o usuário seleciona opções no dropdown
  const handleResponsibleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Converte as opções selecionadas em um array de valores (IDs dos usuários)
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setResponsibles(selectedOptions);
  };

  // Função que trata o envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página)

    // Cria um objeto com os dados do projeto para enviar ao backend
    const projectData = {
      title,
      responsibles, // IDs dos responsáveis selecionados
      area,
      description,
    };

    console.log("Enviando dados do projeto:", projectData);
    // Exemplo de envio de dados para o backend:
    // await fetch('/api/projects', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(projectData)
    // });

    // Fecha o modal após o envio dos dados
    setOpen(false);
  };

  return (
    // Componente Dialog controla a exibição do modal
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Conteúdo do modal com estilos aplicados */}
      <DialogContent className="p-6 max-w-md w-full rounded-xl shadow-xl">
        {/* Cabeçalho do modal com o título centralizado */}
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-4">
            Cadastro de projeto
          </DialogTitle>
        </DialogHeader>

        {/* Formulário para cadastro do projeto */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo para inserir o título do projeto */}
          <div>
            <label className="block text-sm font-medium">Título</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {/* Campo para selecionar os responsáveis pelo projeto (dropdown multi-select) */}
          <div>
            <label className="block text-sm font-medium">Responsáveis</label>
            <select
              multiple
              value={responsibles}
              onChange={handleResponsibleChange}
              className="w-full p-2 border rounded"
            >
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campo para inserir a área de atuação do projeto */}
          <div>
            <label className="block text-sm font-medium">Área de atuação</label>
            <Input value={area} onChange={(e) => setArea(e.target.value)} required />
          </div>

          {/* Campo para inserir a descrição do projeto */}
          <div>
            <label className="block text-sm font-medium">Descrição</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          {/* Rodapé do modal com botões de ação */}
          <DialogFooter className="flex justify-between mt-4">
            {/* Botão para cancelar o cadastro e fechar o modal */}
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            {/* Botão para enviar o formulário */}
            <Button type="submit" className="bg-blue-500 text-white">
              Cadastrar projeto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
