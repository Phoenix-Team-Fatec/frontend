import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.aside
      initial={{ width: 60 }}
      animate={{ width: isOpen ? 200 : 60 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-[20px] bottom-[20px] h-[calc(100%-40px)] bg-[#2D57AA] text-white shadow-lg flex flex-col justify-between p-2 rounded-r-2xl"
    >
      <div>
        <div
          className="text-xl font-bold p-4 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen && "Lumen"}
        </div>
        <nav className={cn("flex flex-col gap-2", !isOpen && "hidden")}> 
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-2 text-sm">
              Texto Genérico
            </div>
          ))}
        </nav>
      </div>
      {isOpen && <div className="p-4 text-sm cursor-pointer">User Name &gt;</div>}
    </motion.aside>
  );
};

export default Sidebar;
