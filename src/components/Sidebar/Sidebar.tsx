import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstRender(false);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarOpen', newState.toString());
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 250 : 80 }}
      transition={isFirstRender ? { duration: 0 } : { duration: 0.3 }}
      className="fixed left-0 top-[20px] bottom-[20px] h-[calc(100%-40px)] bg-[#355EAF] text-white shadow-lg flex flex-col justify-between p-4 rounded-r-2xl z-10"
      style={{ width: isOpen ? '250px' : '80px' }} // Set initial width via style
    >
      {/* Rest of your component remains the same */}
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
              <Button variant="ghost"
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
      <Link href="/settings" className="w-full">
          <div className={`flex items-center gap-2 mb-2 rounded-lg w-full cursor-pointer transition-all hover:bg-[#0c317c] ${isOpen ? "px-4 py-6 bg-[#0c317c75]" : "justify-center p-2"}`}>
                <Avatar className="w-8 h-8">
                    <AvatarImage src="URL_DA_IMAGEM" alt="user"/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {isOpen && (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-white text-sm">User Name</span>
                    <Settings size={16} className="text-white opacity-75"/>
                  </div>
                )}
          </div>
      </Link>
    </motion.aside>
  );
};

export default Sidebar;