import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  ListTodo, 
  Briefcase,
  LogOut,
  Moon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useUser } from "@/hook/UserData";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();
  const user = useUser()
  
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarOpen', newState.toString());
  };

  const handleLougout = () => {
    sessionStorage.removeItem("userData")
    window.location.href = "/sign-in"
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 250 : 80 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-[20px] bottom-[20px] h-[calc(100%-40px)] bg-[#355EAF] text-white shadow-lg flex flex-col justify-between p-4 rounded-r-2xl z-10"
    >

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

      {/* Toggle button for open sidebar */}
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

      {/* Upper Section */}
      <div className="flex flex-col justify-center items-center mt-2">
        {/* Brand Name with Logo */}
        {isOpen ? (
          <div className="text-xl font-bold mb-6 flex items-center">
            <Moon className="mr-2" />
            Lumen
          </div>
        ) : (
          <div className="flex justify-center mb-6">
            <Moon size={24} />
          </div>
        )}

        {/* Profile Image */}
        <Avatar className={`w-40 h-40 mb-6 ${!isOpen && "hidden"}`}>
          <AvatarImage src={user?.user_foto || ""} alt="user" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>

        {!isOpen && (
          <div className="flex flex-col items-center gap-6 mb-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className={`hover:text-[#C5D8FF] hover:bg-transparent cursor-pointer ${
                  pathname === "/dashboard" ? "text-[#C5D8FF]" : "text-white"
                }`}
              >
                <Briefcase size={20} />
              </Button>
            </Link>
            <Link href="/my-tasks">
              <Button 
                variant="ghost"
                size="icon"
                className={`hover:text-[#C5D8FF] hover:bg-transparent cursor-pointer ${
                  pathname === "/my-tasks" ? "text-[#C5D8FF]" : "text-white"
                }`}
              >
                <ListTodo size={20} />
              </Button>
            </Link>
          </div>
        )}

        <ScrollArea className={`w-full ${!isOpen && "hidden"}`}>
          <nav className="flex flex-col gap-2 px-2">
            <Link href="/dashboard" className="w-full">
              <Button
                variant="ghost"
                className={`cursor-pointer w-full justify-start hover:text-[#C5D8FF] hover:bg-transparent ${
                  pathname === "/dashboard" ? "text-[#C5D8FF] font-bold" : "text-white"
                }`}
              >
                <Briefcase className="mr-2" size={18} />
                Meus Projetos
              </Button>
            </Link>
            <Link href="/my-tasks" className="w-full">
              <Button 
                variant="ghost"
                className={`cursor-pointer w-full justify-start hover:text-[#C5D8FF] hover:bg-transparent ${
                  pathname === "/my-tasks" ? "text-[#C5D8FF] font-bold" : "text-white"
                }`}
              >
                <ListTodo className="mr-2" size={18} />
                Minhas tarefas
              </Button>
            </Link>
          </nav>
        </ScrollArea>
      </div>

      {/* Bottom Section (User and Logout) */}
      <div className="w-full">
        <Link href="/settings" className="w-full">
          <div className={`flex items-center gap-2 mb-2 rounded-lg w-full cursor-pointer transition-all hover:bg-[#0c317c] ${isOpen ? "px-4 py-3 bg-[#0c317c75]" : "justify-center p-2"}`}>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.user_foto || ""} alt="user"/>
              <AvatarFallback>
                {user ? `${user.user_nome?.[0] || ''}${user.user_sobrenome?.[0] || ''}` : 'U'}
              </AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="flex items-center justify-between w-full">
                <span className="text-white text-sm">
                  {user ? `${user.user_nome || ''} ${user.user_sobrenome || ''}` : 'Loading...'}
                </span>
                <Settings size={16} className="text-white opacity-75"/>
              </div>
            )}
          </div>
        </Link>
        
        {isOpen ? (
          <Button 
            variant="ghost"
            className="w-full justify-start text-white hover:text-[#C5D8FF] hover:bg-transparent cursor-pointer"
            onClick={handleLougout}
          > 
            <LogOut size={18} className="mr-2" />
            Sair
          </Button>
        ) : (
          <Button 
            variant="ghost"
            size="icon"
            className="w-full flex justify-center mt-4 text-white hover:text-[#C5D8FF] hover:bg-transparent cursor-pointer"
            onClick={handleLougout}
          >
            <LogOut size={20} />
          </Button>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;