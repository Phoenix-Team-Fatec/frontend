// Importando o hook useState para gerenciar estados locais dentro do componente
import { useState } from "react";

//  componentes do shadcn/ui para o  modal 
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Definição do componente ProjectRegistration, que recebe duas props: 
// `open` (define se o modal está aberto ou fechado) e `setOpen` (função para modificar esse estado)
export default function ProjectRegistration({ open, setOpen }) {
  
  // Definição de estados locais para armazenar os dados do formulário
  const [title, setTitle] = useState(""); // Armazena o título do projeto
  const [responsibles, setResponsibles] = useState([]); // Armazena a lista de responsáveis pelo projeto (de inicio vazia)
  const [area, setArea] = useState(""); // Armazena a área de atuação do projeto
  const [description, setDescription] = useState(""); // Armazena a descrição do projeto

  // Função chamada ao enviar o formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // Impede do formulário (recarregar a página)
    console.log({ title, responsibles, area, description }); // Exibe os dados no console para teste
    setOpen(false); // Fecha o modal após o envio
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
          
          {/* Campo de entrada para o título do projeto */}
          <div>
            <label className="block text-sm font-medium">Título</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {/* Campo de entrada para adicionar responsáveis pelo projeto */}
          <div>
            <label className="block text-sm font-medium">Responsáveis</label>
            <Input placeholder="Adicionar responsáveis..." />
          </div>

          {/* Campo de entrada para a área de atuação */}
          <div>
            <label className="block text-sm font-medium">Área de atuação</label>
            <Input value={area} onChange={(e) => setArea(e.target.value)} required />
          </div>

          {/* Campo de entrada para a descrição do projeto */}
          <div>
            <label className="block text-sm font-medium">Descrição</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          {/* Rodapé do modal com botões de ação */}
          <DialogFooter className="flex justify-between mt-4">
            {/* Botão para cancelar o cadastro e fechar o modal */}
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>

            {/* Botão para enviar o formulário */}
            <Button type="submit" className="bg-blue-500 text-white">Cadastrar projeto</Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
}
