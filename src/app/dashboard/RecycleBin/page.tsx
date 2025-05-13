'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar/Sidebar";
import Popup from "@/components/Feedback/popup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUserData } from "@/utils/auth";
import Cards_Projects from "@/components/Cards_Projects/Cards_Projects";
import { Trash2, RotateCw } from "lucide-react";

export default function RecycleBin() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [excludedProjects, setExcludedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //Verifica a autenticação ao carregar a página
  useEffect(() => {
    if (!getUserData()) {
      router.push('/sign-in');
    } else {
      setAuthChecked(true);
      fetchExcludedProjects();//inicia a busca de projetos excluídos
    }
  }, []);

  //Integração com GET /projetos/excluidos
  const fetchExcludedProjects = async () => {
    try {
      setLoading(true);
      //CHamada pra endpoint que lista os projetos excluidos
      const { data } = await axios.get('http://localhost:3000/projetos/excluidos');
      setExcludedProjects(data);
    } catch (error) {
      console.error("Erro ao carregar lixeira", error);
      showNotification("Erro ao carregar projetos excluídos", false);
    } finally {
      setLoading(false);
    }
  };

  //Integração com PUT /projeto/restore/:id
  const handleRestore = async (id: number) => {
    try {
        //chamada pra endpoint que restaura o projeto
      await axios.put(`http://localhost:3000/projeto/restore/${id}`);
      showNotification("Projeto restaurado com sucesso!", true);
      fetchExcludedProjects(); //Atualiza a lista depois da restauração
    } catch (error) {
      console.error("Erro ao restaurar projeto:", error);
      showNotification("Erro ao restaurar projeto", false);
    }
  };

  const showNotification = (message: string, success: boolean) => {
    setPopupMessage(message);
    setIsSuccess(success);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const contentMargin = sidebarOpen ? "ml-[250px]" : "ml-[80px]";

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <Popup
        isOpen={showPopup}
        message={popupMessage}
        isSuccess={isSuccess}
        onClose={() => setShowPopup(false)}
      />

      <div className={`w-full p-8 ${contentMargin} overflow-hidden`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Lixeira</h1>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} //Filtra localmente
              className="w-64"
            />
            <Button //reload dados do backend
              variant="outline"
              onClick={fetchExcludedProjects}
            >
              <RotateCw size={18} className="mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        <hr className="border-t-2 border-[#C4D8FF] my-4" />

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
          </div>

          //Litagem de projetos
        ) : excludedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Trash2 className="w-24 h-24 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Nenhum projeto na lixeira</p>
          </div>
          //Estado vazio
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {excludedProjects
              .filter(project => 
                project.projeto_proj_nome.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(project => (
                <Cards_Projects
                  key={project.projeto_proj_id}
                  {...project}
                  isDeleted={true} //Modo Lixeira
                  onRestore={handleRestore} //Passa função de restauração
                  className="opacity-90 bg-gray-50 border-dashed border-red-200"
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}