"use client";
import { useState, useEffect, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Label } from "../ui/label";
import { Trash2, Check } from "lucide-react";
import { useUser } from "@/hook/UserData";

export default function ProjectRegistration({
  open,
  setOpen,
  onProjectCreated,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  onProjectCreated: (newProjectData: any) => void;
}) {
  const userDataHook = useUser()

  const [title, setTitle] = useState("");
  const [responsibles, setResponsibles] = useState<
    { email: string; user_id?: number }[]
  >([]);
  const [responsibleInput, setResponsibleInput] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [availableUsers, setAvailableUsers] = useState<
    { user_id: number; name: string; email: string; user_foto: string; }[]
  >([]);
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

        // Supondo que a API retorne user_email
        const formattedUsuario = data.map((user: any) => ({
          user_id: user.user_id,
          name: `${user.user_nome} ${user.user_sobrenome ?? ""}`.trim(),
          email: user.user_email,
          user_foto: user.user_foto
        }));

        setAvailableUsers(formattedUsuario);
      } catch (error) {
        console.error("Erro ao carregar usuários", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (userDataHook && userDataHook.user_email && userDataHook.user_id) {
      setResponsibles((prev) => {
        if (prev.find((r) => r.email === userDataHook.user_email)) {
          return prev;
        }
        return [{ email: userDataHook.user_email, user_id: userDataHook.user_id, isCreator: true }, ...prev];
      });
    }
  }, [userDataHook]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddResponsible = () => {
    const email = responsibleInput.trim();
    if (email !== "" && emailRegex.test(email)) {
      // Verifica se já existe
      if (responsibles.some((r) => r.email === email)) return;

      const userMatch = availableUsers.find((u) => u.email === email);
      setResponsibles([
        ...responsibles,
        { email, user_id: userMatch?.user_id }
      ]);
      setResponsibleInput("");
    } else {
      alert("Por favor, insira um email válido.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddResponsible();
    }
  };

  const handleRemoveResponsible = (index: number) => {
    if (responsibles[index].email === userDataHook.user_email) return;
    setResponsibles(responsibles.filter((_, i) => i !== index));
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
            <Label htmlFor="responsible" className="block text-sm font-medium text-gray-700 mb-1">
              Responsáveis
            </Label>
            <div className="flex">
              <Input
                id="responsible"
                type="email"
                placeholder="teste@example.com"
                value={responsibleInput}
                onChange={(e) => setResponsibleInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                onClick={handleAddResponsible}
                className="ml-2 px-4 rounded-r-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Adicionar
              </Button>
            </div>

            {responsibles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {responsibles.map((userData, index) => {
                  // Busca detalhes do usuário se existir
                  const userDetails = availableUsers.find((user) => user.email === userData.email);
                  const isCreator = userData.email === userDataHook.user_email;
                  return (
                    <div
                      key={index}
                      className="relative flex items-center bg-gray-100 border border-gray-200 rounded-full shadow-sm transition hover:shadow-md px-3 py-1"
                    >
                      {/* Label menor com hover controlando tooltip e botão */}
                      <div className="group relative flex items-center cursor-default">
                        {/* Avatar ou inicial */}
                        <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 overflow-hidden">
                          {userDetails?.user_foto ? (
                            <>
                              <img
                                src={userDetails.user_foto}
                                alt="Foto do usuário"
                                className={`w-5 h-5 rounded-full block ${!isCreator ? "group-hover:hidden" : ""}`}
                              />
                              {!isCreator && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveResponsible(index)}
                                  className="hidden group-hover:block w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer"
                                >
                                  ×
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <div
                                className={`w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-700  ${!isCreator ? "group-hover:hidden" : ""}`}>
                                {userData.email.charAt(0).toUpperCase()}
                              </div>
                              {!isCreator && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveResponsible(index)}
                                  className="hidden group-hover:block w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer"
                                >
                                  ×
                                </button>
                              )}
                            </>
                          )}
                        </div>

                        {/* Email */}
                        <span className="ml-2 text-sm text-gray-800">{userData.email}</span>

                        {/* Tooltip (detalhes) */}
                        <div className="absolute left-0 top-full mt-1 w-max p-2 bg-white border border-gray-300 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-20">
                          {userDetails ? (
                            <div className="text-xs text-gray-600">
                              <img
                                src={userDetails.user_foto}
                                alt="Foto do usuário"
                                className="w-10 h-10 rounded-full mb-1"
                              />
                              <p><strong>Nome:</strong> {userDetails.name}</p>
                              <p><strong>Email:</strong> {userDetails.email}</p>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-600">
                              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 mb-1">
                                {userData.email.charAt(0).toUpperCase()}
                              </div>
                              <p><strong>Usuário não cadastrado</strong></p>
                              <p>{userData.email}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  );
                })}
              </div>
            )}
          </div>

          {/* <div>
              <label className="block text-sm font-medium text-gray-700">Área de atuação</label>
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
                  className={`px-3 py-1 rounded-full cursor-pointer flex items-center space-x-1 border ${selectedAreas.includes(area)
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

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant="outline"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
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
        </form >
      </DialogContent >
    </Dialog >
  );
}