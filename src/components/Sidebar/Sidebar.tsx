import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; 
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{ width: isOpen ? 250 : 80 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-[20px] bottom-[20px] h-[calc(100%-40px)] bg-[#2D57AA] text-white shadow-lg flex flex-col justify-between p-4 rounded-r-2xl"
    >
      {/* Botão de Expandir/Retrair */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-[0px] top-5 bg-[#2D57AA] text-white p-1 px-2 rounded-r-lg"
          onClick={() => setIsOpen(true)}
        >
          <ChevronRight />
        </Button>
      )}

      {isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-5 text-white text-xl"
          onClick={() => setIsOpen(false)}
        >
          <ChevronLeft />
        </Button>
      )}

      {/* Parte Superior */}
      <div className="flex flex-col items-center mt-2">
        {/* Nome da marca */}
        {isOpen && <div className="text-xl font-bold mb-6">Lumen</div>}

        {/* Imagem de Perfil */}
        <Avatar className={`w-16 h-16 mb-6 ${!isOpen && "hidden"}`}>
          <AvatarImage src="URL_DA_IMAGEM" alt="Profile" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>

        {/* Links de Navegação */}
        <ScrollArea className={`w-full ${!isOpen && "hidden"}`}>
          <nav className="flex flex-col gap-4">
            <Button variant="ghost" className="justify-start">
              Meus Projetos
            </Button>
            <Button variant="ghost" className="justify-start">
              Minhas Tarefas
            </Button>
          </nav>
        </ScrollArea>
      </div>

      {/* Parte Inferior (Usuário) */}
      <div className="flex items-center gap-2 mb-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src="URL_DA_IMAGEM" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        {isOpen && <div className="text-sm cursor-pointer">User Name &gt;</div>}
      </div>
    </motion.aside>
  );
};

export default Sidebar;