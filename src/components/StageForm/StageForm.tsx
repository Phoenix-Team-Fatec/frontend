import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StageFormProps {
  stage: {
    nome: string;
    descricao: string;
    dataInicio: string;
    dataFim: string;
    status: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function StageForm({ stage, onChange, onSubmit, isSubmitting }: StageFormProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Nome da etapa"
        value={stage.nome}
        onChange={(e) => onChange("nome", e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      
      <Input
        placeholder="Descrição"
        value={stage.descricao}
        onChange={(e) => onChange("descricao", e.target.value)}
        className="w-full p-2 border rounded"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
          <Input
            type="date"
            value={stage.dataInicio}
            onChange={(e) => onChange("dataInicio", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
          <Input
            type="date"
            value={stage.dataFim}
            onChange={(e) => onChange("dataFim", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <Button 
        onClick={onSubmit}
        disabled={!stage.nome.trim() || isSubmitting}
        className="w-full bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] font-medium py-2 rounded"
      >
        {isSubmitting ? "Salvando..." : "Criar Etapa"}
      </Button>
    </div>
  );
}