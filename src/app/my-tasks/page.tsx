"use client";
import { useState, useEffect } from 'react';
import { Search, Grid, List, Filter } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import axios from 'axios';
import { getUserData } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SimpleAIChat from '@/components/SimpleAIChat/SimpleAIChat';

interface Etapa {
  etapa_id: number;
  etapa_nome: string;
}

interface Task {
  tarefa_id: number;
  tarefa_nome: string;
  tarefa_descricao: string;
  tarefa_data_inicio: string;
  tarefa_data_fim: string;
  tarefa_status: boolean;
  etapa: Etapa;
  usuarios?: Array<{
    user_nome: string;
    user_email: string;
  }>;
  pontos_historias:number
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      router.push('/sign-in');
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/tarefa_usuario/${userData.user_id}`);
        
        const tasksWithEtapa = response.data.map((task: any) => ({  
          ...task,
          etapa: task.etapa ? {
            etapa_id: task.etapa.etapa_id,
            etapa_nome: task.etapa.etapa_nome
          } : {
            etapa_id: 0,
            etapa_nome: 'Sem etapa'
          },
          tarefa_data_inicio: formatDate(task.tarefa_data_inicio),
          tarefa_data_fim: formatDate(task.tarefa_data_fim),
          pontos_historias: task.pontos_historias
        }));
    
        setTasks(tasksWithEtapa);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Erro ao carregar tarefas');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Adicione esta função para forçar recarregamento das tarefas
const refreshTasks = async () => {
  const userData = getUserData();
  if (!userData) return;

  try {
    const response = await axios.get(`http://localhost:3000/tarefa_usuario/${userData.user_id}`);
    const tasksWithEtapa = response.data.map((task: any) => ({  
      ...task,
      etapa: task.etapa ? {
        etapa_id: task.etapa.etapa_id,
        etapa_nome: task.etapa.etapa_nome
      } : {
        etapa_id: 0,
        etapa_nome: 'Sem etapa'
      },
      tarefa_data_inicio: formatDate(task.tarefa_data_inicio),
      tarefa_data_fim: formatDate(task.tarefa_data_fim),
      pontos_historias: task.pontos_historias
    }));
    setTasks(tasksWithEtapa);
  } catch (error) {
    console.error('Error refreshing tasks:', error);
    toast.error('Erro ao atualizar tarefas');
  }
};

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm === '' ||
      task.tarefa_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.etapa.etapa_nome.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterBy === '' ||
      (task.tarefa_status ? 'Concluída' : 'Pendente').toLowerCase() === filterBy.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const filterOptions: string[] = [
    'Concluída',
    'Pendente'
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <SimpleAIChat onTaskUpdate={refreshTasks} />
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-[250px]' : 'w-20'
        } overflow-hidden`}
      >
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ease-in-out overflow-hidden">
        <div className="max-w-8xl mx-5 p-4">
          <h1 className="text-2xl font-bold text-gray-700 mt-5 mb-2">Minhas Tarefas</h1>
          
          <div className="pr-1">
            <hr className="border-t-2 border-[#C4D8FF] my-4" />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-4 py-2"
              >
                <Filter size={16} />
                <span>Filtrar por: {filterBy || 'Todos'}</span>
              </button>

              {filterOpen && (
                <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                  <ul className="py-1">
                    <li
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        setFilterBy('');
                        setFilterOpen(false);
                      }}
                    >
                      Todos
                    </li>
                    {filterOptions.map((option) => (
                      <li
                        key={option}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => {
                          setFilterBy(option);
                          setFilterOpen(false);
                        }}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-full border-gray-300 pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-200 rounded-lg">
              <button
                className={`p-2 ${view === 'list' ? 'bg-[#355EAF] text-white' : 'bg-gray-200 text-[#355EAF]'} rounded-l-lg`}
                onClick={() => setView('list')}
              >
                <List size={20} />
              </button>
              <button
                className={`p-2 ${view === 'grid' ? 'bg-[#355EAF] text-white' : 'bg-gray-200 text-[#355EAF]'} rounded-r-lg`}
                onClick={() => setView('grid')}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>

          {/* List View */}
          {view === 'list' && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarefa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pontos Histórias</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Início</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Limite</th>

                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.map((task) => (
                      <tr key={task.tarefa_id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.tarefa_id}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              task.tarefa_status
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {task.tarefa_status ? 'Concluída' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{task.tarefa_nome}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{task.etapa.etapa_nome}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{task.pontos_historias}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{task.tarefa_data_inicio}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{task.tarefa_data_fim}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Grid View */}
          {view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <div key={task.tarefa_id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">#{task.tarefa_id}</span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${
                        task.tarefa_status
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.tarefa_status ? 'Concluída' : 'Pendente'}
                    </span>
                  </div>
                  <h3 className="font-medium text-lg mb-1">{task.tarefa_nome}</h3>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Etapa:</span> {task.etapa.etapa_nome}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Pontos Histórias:</span> {task.pontos_historias}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Início:</span> {task.tarefa_data_inicio}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Limite:</span> {task.tarefa_data_fim}
                  </div>
                  {task.usuarios && task.usuarios.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <span className="text-xs font-medium text-gray-500">Responsáveis:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.usuarios.map((user, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {user.user_nome}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}