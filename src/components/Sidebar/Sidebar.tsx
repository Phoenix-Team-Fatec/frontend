import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{ width: isOpen ? 250 : 80 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-[20px] bottom-[20px] h-[calc(100%-40px)] bg-[#355EAF] text-white shadow-lg flex flex-col justify-between p-4 rounded-r-2xl z-10"
    >
      {/* Botão de Expandir/Retrair */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-[0px] top-5 bg-[#355EAF] text-white p-1 px-2 rounded-r-lg cursor-pointer hover:bg-transparent hover:text-[#C5D8FF]"
          onClick={toggleSidebar}
        >
          <ChevronRight />
        </Button>
      )}

      {isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-5 text-white text-2xl cursor-pointer hover:bg-transparent hover:text-[#C5D8FF]"
          onClick={toggleSidebar}
        >
          <ChevronLeft />
        </Button>
      )}

      {/* Parte Superior */}
      <div className="flex flex-col justify-center items-center mt-2">
        {/* Nome da marca */}
        {isOpen && <div className="text-xl font-bold mb-6">Lumen</div>}

        {/* Imagem de Perfil */}
        <Avatar className={`w-40 h-40 mb-6 ${!isOpen && "hidden"}`}>
          <AvatarImage src="URL_DA_IMAGEM" alt="Profile" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>

        {/* Links de Navegação */}
        <ScrollArea className={`w-full ${!isOpen && "hidden"}`}>
          <nav className="flex flex-col justify-center items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className={`cursor-pointer hover:text-[#C5D8FF] hover:bg-transparent ${
                  pathname === "/dashboard" ? "text-[#C5D8FF] font-bold" : "text-white"
                }`}
              >
                Meus Projetos
              </Button>
            </Link>
            <Link href="/tasks">
              <Button 
                variant="ghost"
                className={`cursor-pointer hover:text-[#C5D8FF] hover:bg-transparent ${
                  pathname === "/tasks" ? "text-[#C5D8FF] font-bold" : "text-white"
                }`}
              >
                Minhas Tarefas
              </Button>
            </Link> 
          </nav>
        </ScrollArea>
      </div>

      {/* Parte Inferior (Usuário) */}
      <div className={`flex items-center gap-2 mb-2 rounded-lg w-full cursor-pointer ${isOpen ? "px-4 py-6 bg-[#0c317c]" : "justify-center"}`}>
        <Avatar className="w-8 h-8">
          <AvatarImage src="URL_DA_IMAGEM" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        {isOpen && (
          <div className="text-white text-sm px-4 py-2 rounded-md w-full text-center">
            User Name
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;