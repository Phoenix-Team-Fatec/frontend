"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CardItem from "@/components/Cards_Projects/Cards_Projects";
import { Plus } from "lucide-react"; // Ícone de "+" estilizado
import Sidebar from "@/components/Sidebar/Sidebar";

export default function Dashboard() {
  const [cards, setCards] = useState<number[]>([]);
  const [imageVisible, setImageVisible] = useState(true);

  const addCard = () => {
    setCards([...cards, cards.length + 1]);
    setImageVisible(false); // Quando o card for adicionado, esconder a imagem
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex flex-col items-center gap-4 w-full">
        {/* Centralização da imagem */}
        {imageVisible && (
          <div className="flex justify-center items-center flex-col">
            <img
              src="https://storyset.com/work"
              alt="Work Illustration"
              className="max-w-full h-auto"
            />
            <p className="text-gray-500 text-sm mt-2">
              Seus projetos aparecerão aqui, e quando a pessoa adicionar um card, a imagem desaparecerá.
            </p>
          </div>
        )}

        {/* Cards */}
        <div className="flex flex-wrap gap-2">
          {cards.map((id) => (
            <CardItem key={id} id={id} />
          ))}
        </div>

        {/* Botão flutuante no canto inferior esquerdo */}
        <Button
          onClick={addCard}
          className="fixed bottom-4 right-4 w-[70px] h-[70px] rounded-full bg-[#2D57AA] text-white flex items-center justify-center shadow-lg hover:bg-blue-700"
        >
          <Plus size={40} />
        </Button>
      </div>
    </div>
  );
}
