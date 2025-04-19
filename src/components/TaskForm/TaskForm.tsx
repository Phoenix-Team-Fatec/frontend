import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TaskFormProps {
  task: {
    nome: string;
    descricao: string;
    data_inicio: string;
    data_fim: string;
    tarefa_status: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function TaskForm({ task, onChange, onSubmit, isSubmitting }: TaskFormProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Nome da tarefa"
        value={task.nome}
        onChange={(e) => onChange("nome", e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      
      <Textarea
        placeholder="Descrição"
        value={task.descricao}
        onChange={(e) => onChange("descricao", e.target.value)}
        className="w-full p-2 border rounded"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</Label>
          <Input
            type="date"
            value={task.data_inicio.split('T')[0]}
            onChange={(e) => onChange("data_inicio", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</Label>
          <Input
            type="date"
            value={task.data_fim.split('T')[0]}
            onChange={(e) => onChange("data_fim", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="task-status"
          checked={task.tarefa_status}
          onCheckedChange={(checked) => {
            if (typeof checked === 'boolean') {
              onChange("tarefa_status", checked);
            }
          }}
        />
        <Label htmlFor="task-status" className="text-sm font-medium">
          Tarefa concluída
        </Label>
      </div>
      
      <Button 
        onClick={onSubmit}
        disabled={!task.nome.trim() || isSubmitting}
        className="w-full bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] font-medium py-2 rounded"
      >
        {isSubmitting ? "Salvando..." : "Adicionar Tarefa"}
      </Button>
    </div>
  );
}