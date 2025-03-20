"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CardItem from "@/components/Cards_Projects/Cards_Projects";

export default function Dashboard() {
  const [cards, setCards] = useState<number[]>([]);

  const addCard = () => {
    setCards([...cards, cards.length + 1]);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-xl font-bold">Dashboard de Projetos</h1>
      <Button onClick={addCard} variant="outline">
        + Adicionar Projeto
      </Button>
      <div className="flex flex-wrap gap-2">
        {cards.map((id) => (
          <CardItem key={id} id={id} />
        ))}
      </div>
    </div>
  );
}
