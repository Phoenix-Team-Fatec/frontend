"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Label } from "../ui/label";
import { Trash2, Check } from "lucide-react";

export default function ProjectRegistration({
  open,
  setOpen,
  onProjectCreated,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  onProjectCreated: (newProjectData: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [responsibles, setResponsibles] = useState<string[]>([]);
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [availableUsers, setAvailableUsers] = useState<{ id: string; name: string }[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [areasList, setAreasList] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]); // Áreas selecionadas para este projeto
  const [partnerInstitutions, setPartnerInstitutions] = useState<string[]>([]);
  const [fundingInstitutions, setFundingInstitutions] = useState<string[]>([]);
  const [projectValue, setProjectValue] = useState("");

  // Simulação de áreas já cadastradas no banco de dados
  // Na implementação com o back ira vir de uma chamada API
  const [storedAreas, setStoredAreas] = useState<string[]>([
    "Saúde Pública",
    "Educação",
    "Tecnologia",
    "Meio Ambiente"
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/usuarios");

        const formattedUsuario = data.map((user: any) => ({
          id: user.user_id.toString(),
          name: `${user.user_nome} ${user.user_sobrenome ?? ""}`.trim(),
        }));

        setAvailableUsers(formattedUsuario);
      } catch (error) {
        console.error("Erro ao carregar usuários", error);
      }
    };
    fetchUsers();
  }, []);

  const handleResponsibleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setResponsibles(selectedOptions);
  };

  const addArea = () => {
    if (area && !areasList.includes(area)) {
      setAreasList([...areasList, area]);
      // Simulação: add também às áreas armazenadas no "banco de dados"
      // Na implementação com o back, isso seria uma chamada API POST para salvar a nova área
      setStoredAreas(prev => [...prev, area]);
      setArea("");
    }
  };

  const removeArea = (areaToRemove: string) => {
    setAreasList(areasList.filter((a) => a !== areaToRemove));
    // Remove também das selecionadas, se estiver lá
    setSelectedAreas(selectedAreas.filter(a => a !== areaToRemove));
  };

  const toggleAreaSelection = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const projectData = {
      title,
      responsibles,
      description,
      startDate,
      endDate,
      selectedAreas, // Agora usamos as áreas selecionadas
      partnerInstitutions,
      fundingInstitutions,
      projectValue,
    };

    console.log("Enviando dados do projeto:", projectData);
    // Futuro envio para backend vao ser algo : await axios.post('/projetos', projectData);
    onProjectCreated(projectData);
    setOpen(false);
  };

  const handleInstitutionInput = (
    e: ChangeEvent<HTMLInputElement>,
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[],
    max: number
  ) => {
    const value = e.target.value;
    if (value && !list.includes(value) && list.length < max) {
      setList([...list, value]);
      e.target.value = "";
    }
  };

  const removeInstitution = (
    institution: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[]
  ) => {
    setList(list.filter((i) => i !== institution));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tighter text-center">
            Cadastro de projeto
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Responsáveis</label>
            <select
              multiple
              value={responsibles}
              onChange={handleResponsibleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Área de atuação</label>
            <div className="flex space-x-2">
              <Input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="flex-1"
                placeholder="Digite uma nova área"
              />
              <Button 
                type="button" 
                onClick={addArea}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Adicionar
              </Button>
            </div>
          </div>

          {/* Áreas já cadastradas (simulando busca no banco de dados) */}
          <div className="space-y-2">
            <Label>Áreas disponíveis</Label>
            <div className="flex flex-wrap gap-2">
              {storedAreas.map((area, index) => (
                <div
                  key={`stored-${index}`}
                  onClick={() => toggleAreaSelection(area)}
                  className={`px-3 py-1 rounded-full cursor-pointer flex items-center space-x-1 border ${
                    selectedAreas.includes(area) 
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {selectedAreas.includes(area) && <Check size={14} className="text-green-600" />}
                  <span>{area}</span>
                </div>
              ))}
            </div>
            {selectedAreas.length > 0 && (
              <div className="mt-2 text-sm text-green-600">
                {selectedAreas.length} área(s) selecionada(s) para este projeto
              </div>
            )}
          </div>

          {/* Áreas cadastradas durante a sessão atual  */}
          {areasList.length > 0 && (
            <div className="space-y-1">
              <Label>Áreas cadastradas nesta sessão</Label>
              <ul className="space-y-1">
                {areasList.map((a, index) => (
                  <li
                    key={`new-${index}`}
                    className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded"
                  >
                    <span>{a}</span>
                    <Trash2
                      size={16}
                      className="text-red-500 cursor-pointer"
                      onClick={() => removeArea(a)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Instituições Parceiras (máx. 5)</Label>
            <Input
              placeholder="Digite e pressione Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInstitutionInput(
                    e as unknown as ChangeEvent<HTMLInputElement>,
                    setPartnerInstitutions,
                    partnerInstitutions,
                    5
                  );
                }
              }}
            />
            {partnerInstitutions.length > 0 && (
              <ul className="mt-2 space-y-1">
                {partnerInstitutions.map((item, i) => (
                  <li key={i} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
                    <span>{item}</span>
                    <Trash2
                      size={16}
                      className="text-red-500 cursor-pointer"
                      onClick={() =>
                        removeInstitution(item, setPartnerInstitutions, partnerInstitutions)
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <Label>Instituições Financiadoras (máx. 3)</Label>
            <Input
              placeholder="Digite e pressione Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInstitutionInput(
                    e as unknown as ChangeEvent<HTMLInputElement>,
                    setFundingInstitutions,
                    fundingInstitutions,
                    3
                  );
                }
              }}
            />
            {fundingInstitutions.length > 0 && (
              <ul className="mt-2 space-y-1">
                {fundingInstitutions.map((item, i) => (
                  <li key={i} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
                    <span>{item}</span>
                    <Trash2
                      size={16}
                      className="text-red-500 cursor-pointer"
                      onClick={() =>
                        removeInstitution(item, setFundingInstitutions, fundingInstitutions)
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <Label>Valor total do Projeto</Label>
            <Input
              type="text"
              value={projectValue}
              onChange={(e) => setProjectValue(e.target.value)}
              placeholder="Ex: R$ 100.000,00"
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <div>
              <label>Início:</label>
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-1 rounded-md"
              />
            </div>
            <div>
              <label>Fim:</label>
              <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-1 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-2 w-full">
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="flex-1 text-[#355EAF] border border-[#355EAF] hover:text-[#2d4f95] cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] cursor-pointer"
            >
              Cadastrar projeto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}