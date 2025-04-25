"use client";
import { useState, useEffect } from 'react';
import { Search, Grid, List, Filter } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';

interface Task {
  id: string;
  status: 'Paid' | 'Pending' | 'Unpaid';
  projeto: string;
  orcamento: number;
  dataLimite: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {

            {/* a conexão com o bd tem que subistituir isso aqui */}

      const data: Task[] = [
        { id: 'INV001', status: 'Paid', projeto: 'Credit Card', orcamento: 250.0, dataLimite: '27/02/25' },
        { id: 'INV002', status: 'Pending', projeto: 'PayPal', orcamento: 150.0, dataLimite: '28/02/12' },
        { id: 'INV003', status: 'Unpaid', projeto: 'Bank Transfer', orcamento: 350.0, dataLimite: '27/02/25' },
        { id: 'INV004', status: 'Paid', projeto: 'Credit Card', orcamento: 450.0, dataLimite: '28/02/12' },
        { id: 'INV005', status: 'Paid', projeto: 'PayPal', orcamento: 550.0, dataLimite: '27/02/25' },
        { id: 'INV006', status: 'Pending', projeto: 'Bank Transfer', orcamento: 200.0, dataLimite: '28/02/12' },
        { id: 'INV007', status: 'Unpaid', projeto: 'Credit Card', orcamento: 300.0, dataLimite: '27/02/25' },
      ];
      setTasks(data);
    };

    fetchData();
  }, []);

  const total = tasks.reduce((sum, task) => sum + task.orcamento, 0);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm === '' ||
      Object.values(task).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter =
      filterBy === '' ||
      task.status.toLowerCase() === filterBy.toLowerCase() ||
      task.projeto.toLowerCase() === filterBy.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const filterOptions: string[] = [
    'Status',
    'Projeto',
    'ID',
    'Data Limite',
    'Paid',
    'Pending',
    'Unpaid',
    'Credit Card',
    'PayPal',
    'Bank Transfer',
  ];

  return (
    <div className="flex min-h-screen bg-white">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orçamento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Limite</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.map((task) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.id}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              task.status === 'Paid'
                                ? 'bg-green-100 text-green-800'
                                : task.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{task.projeto}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">${task.orcamento.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{task.dataLimite}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200">
                      <td className="px-6 py-4 text-sm font-bold">Total</td>
                      <td colSpan={3} className="px-6 py-4 text-sm font-bold text-right">${total.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Grid View */}
          {view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{task.id}</span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${
                        task.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Projeto:</span> {task.projeto}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Orçamento:</span> ${task.orcamento.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Data Limite:</span> {task.dataLimite}
                  </div>
                </div>
              ))}
              <div className="bg-gray-50 p-4 rounded-lg shadow col-span-full">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
