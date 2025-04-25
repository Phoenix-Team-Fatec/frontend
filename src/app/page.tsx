"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState({
    section1: false,
    section2: false,
    section3: false
  });

  // Função para lidar com a visibilidade das seções durante a rolagem
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["section1", "section2", "section3"];
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInView = rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0;
          
          setIsVisible(prev => ({
            ...prev,
            [section]: isInView
          }));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    // Verificar visibilidade inicial
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    if (typeof window !== "undefined") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header com animação ao rolar */}
      <header className="fixed top-0 w-full z-20 transition-all duration-300">
        <div className="backdrop-blur-md bg-white/90  py-4">
          <nav className="flex justify-center space-x-8 font-semibold text-base max-w-7xl mx-auto px-4">
            <Link 
              href="/sign-in" 
              className={`${
                pathname === "/sign-in" ? "text-[#355EAF]" : "text-black"
              } transition-colors duration-300 ease-in-out hover:text-[#355EAF]`}
            >
              Entrar
            </Link>
            <Link 
              href="/" 
              className={`${
                pathname === "/" ? "text-[#355EAF]" : "text-black"
              } transition-colors duration-300 ease-in-out hover:text-[#355EAF]`}
            >
              Início
            </Link>
            <button 
              onClick={() => scrollToSection("section1")} 
              className="text-black transition-colors duration-300 ease-in-out hover:text-[#355EAF]"
            >
              Recursos
            </button>
            <button 
              onClick={() => scrollToSection("section2")} 
              className="text-black transition-colors duration-300 ease-in-out hover:text-[#355EAF]"
            >
              Colaboração
            </button>
          </nav>
        </div>
      </header>

      <div className="h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat mt-0"
        style={{
          backgroundImage: "url('/bg_inicial.png')", 
        }}
      >
        <div className="relative w-full h-screen flex items-center">
          
          <div className="absolute right-0 w-3/5 h-full ">
            <Image
              src="/home.png" 
              alt="Illustration"
              layout="fill"
              objectFit="cover" 
              className="z-2"
            />
          </div>

          <div className="relative z-10 text-left px-40 space-y-4 w-full max-w-[60%]">
            <p className="text-[40px] font-bold text-[#11264C]">
              Organize seus projetos acadêmicos com eficiência
            </p>
            <p className="text-base font-semibold text-gray-700 ">
              O Lumen é uma plataforma projetada para ajudar estudantes e pesquisadores a gerenciarem suas tarefas, projetos e prazos com facilidade.
            </p>
            <Link href="/sign-up">
              <button className="mt-4 px-12 py-3 bg-[#355EAF] text-white font-medium rounded-[25px] 
              text-base transition-all duration-300 ease-in-out hover:bg-[#2C4B8B] cursor-pointer shadow-lg hover:shadow-xl">
                Começar
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Section 1 - Recursos e Funcionalidades */}
      <section id="section1" className="min-h-screen py-20 flex flex-col justify-center bg-gradient-to-b from-white to-gray-100">
        <div className={`container mx-auto px-8 transition-all duration-1000 ${isVisible.section1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-[#11264C] text-center mb-16">Recursos que transformam sua experiência acadêmica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center">
              <div className="bg-[#EBF2FF] rounded-full p-4 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#355EAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#355EAF] mb-3">Gestão de Tarefas</h3>
              <p className="text-gray-600 text-center mb-4">Organize todas as suas atividades acadêmicas em um só lugar com categorização inteligente e priorização.</p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Listas personalizáveis</li>
                <li>Lembretes automáticos</li>
                <li>Visualização em calendário</li>
              </ul>
              <button className="mt-auto px-6 py-2 bg-[#EBF2FF] text-[#355EAF] font-medium rounded-full hover:bg-[#355EAF] hover:text-white transition-all duration-300">
                Explorar
              </button>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center">
              <div className="bg-[#EBF2FF] rounded-full p-4 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#355EAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#355EAF] mb-3">Planejamento de Projetos</h3>
              <p className="text-gray-600 text-center mb-4">Divida seus projetos em etapas gerenciáveis e acompanhe seu progresso de forma visual.</p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Gráficos de Gantt</li>
                <li>Marcos e entregas</li>
                <li>Dependências de tarefas</li>
              </ul>
              <button className="mt-auto px-6 py-2 bg-[#EBF2FF] text-[#355EAF] font-medium rounded-full hover:bg-[#355EAF] hover:text-white transition-all duration-300">
                Descobrir
              </button>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center">
              <div className="bg-[#EBF2FF] rounded-full p-4 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#355EAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#355EAF] mb-3">Análise de Desempenho</h3>
              <p className="text-gray-600 text-center mb-4">Monitore sua produtividade e identifique áreas para melhorar com relatórios detalhados.</p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Métricas personalizadas</li>
                <li>Gráficos interativos</li>
                <li>Exportação de dados</li>
              </ul>
              <button className="mt-auto px-6 py-2 bg-[#EBF2FF] text-[#355EAF] font-medium rounded-full hover:bg-[#355EAF] hover:text-white transition-all duration-300">
                Analisar
              </button>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <button onClick={() => scrollToSection("section2")} className="px-10 py-3 bg-[#355EAF] text-white font-medium rounded-full hover:bg-[#2C4B8B] transition-all duration-300 flex items-center mx-auto space-x-2 shadow-md hover:shadow-lg">
              <span>Conheça mais recursos</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v10.586l-3.293-3.293a1 1 0 10-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L11 14.586V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Section 2 - Colaboração */}
      <section id="section2" className="min-h-screen py-20 flex items-center bg-gradient-to-r from-[#355EAF] to-[#2C4B8B] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white rounded-full -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-white rounded-full bottom-20 right-10"></div>
          <div className="absolute w-64 h-64 bg-white rounded-full top-40 right-40"></div>
        </div>
        
        <div className={`container mx-auto px-8 relative z-10 transition-all duration-1000 ${isVisible.section2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-white">
              <h2 className="text-4xl font-bold mb-8">Colaboração que potencializa resultados</h2>
              <p className="text-lg mb-6 text-gray-100">
                Conecte-se com colegas e professores em um ambiente virtual que simplifica o trabalho em equipe e maximiza a produtividade acadêmica.
              </p>
              
              <div className="space-y-6 mt-10">
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-2 rounded-full mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#355EAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Espaços compartilhados</h3>
                    <p className="text-gray-200">Crie salas de projeto onde todos podem contribuir, compartilhar recursos e acompanhar o progresso em tempo real.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-2 rounded-full mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#355EAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Comunicação integrada</h3>
                    <p className="text-gray-200">Discuta ideias, compartilhe feedback e resolva problemas sem precisar alternar entre diferentes plataformas.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-2 rounded-full mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#355EAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Controle de permissões</h3>
                    <p className="text-gray-200">Defina diferentes níveis de acesso para garantir que cada membro da equipe tenha as permissões adequadas.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link href="/sign-up">
                  <button className="px-8 py-3 bg-white text-[#355EAF] font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-100">
                    Iniciar colaboração
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-10 lg:mt-0">
              <div className="bg-white p-6 rounded-xl shadow-2xl">
                <div className="rounded-lg overflow-hidden">
                  <Image 
                    src="/collaboration-demo.png" 
                    alt="Colaboração no Lumen" 
                    width={600} 
                    height={400}
                    className="object-cover w-full h-auto"
                    // Substituir por uma imagem real da sua plataforma
                  />
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-[#11264C]">Projeto de pesquisa: Análise de dados</h4>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Em andamento</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs">MS</div>
                      <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white text-xs">JP</div>
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs">LF</div>
                    </div>
                    <span className="text-sm text-gray-500">+2 colaboradores</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#355EAF] h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">70% concluído</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Benefícios */}     
      <section className="bg-gradient-to-b from-white to-blue-50 py-20"> {/* Light gradient background */}
        <div className="container mx-auto px-8">
         
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">O que nossos usuários dizem</h2> {/* Darker text for contrast */}
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Veja como o Lumen tem ajudado estudantes e pesquisadores em todo o Brasil a transformar sua vida acadêmica.
            </p>
          </div>
          
          {/* Cards de depoimentos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-md min-w-[300px] flex-1 hover:shadow-lg transition-shadow duration-300"> {/* White cards with subtle border and shadow */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 mr-4"></div> {/* Light blue avatar background */}
                <div>
                  <h4 className="text-gray-900 font-semibold">Ana Silva</h4>
                  <p className="text-blue-600 text-sm">Mestranda, UFRJ</p> {/* Blue text for accent */}
                </div>
              </div>
              <p className="text-gray-700">
                "O Lumen revolucionou minha organização acadêmica. Consigo gerenciar meus artigos, prazos e bibliografia de forma muito mais eficiente. Minha produtividade aumentou consideravelmente!"
              </p>
              <div className="flex text-yellow-500 mt-4"> {/* Yellow stars */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
          
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-md min-w-[300px] flex-1 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 mr-4"></div>
                <div>
                  <h4 className="text-gray-900 font-semibold">João Paulo</h4>
                  <p className="text-blue-600 text-sm">Professor, USP</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Desde que adotei o Lumen para gerenciar os projetos do meu laboratório, a produtividade da equipe aumentou significativamente e a comunicação melhorou entre todos os pesquisadores."
              </p>
              <div className="flex text-yellow-500 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
          
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-md min-w-[300px] flex-1 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 mr-4"></div>
                <div>
                  <h4 className="text-gray-900 font-semibold">Fernanda Costa</h4>
                  <p className="text-blue-600 text-sm">Estudante de Graduação, UFMG</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Como estudante com TDAH, sempre tive dificuldades para organizar meus estudos. O Lumen me ajudou a criar uma rotina estruturada e nunca mais perdi um prazo de entrega."
              </p>
              <div className="flex text-yellow-500 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    
        {/* Footer */}
    <footer className="bg-[#11264C] text-white py-16">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h4 className="font-bold text-xl mb-4">Lumen</h4>
            <p className="text-gray-300 mb-4">
              Transformando a gestão acadêmica para estudantes e pesquisadores em todo o Brasil.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Preços</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Casos de uso</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Guias</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Comunidade</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Webinars</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sobre nós</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Carreiras</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contato</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacidade</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Lumen. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Termos de Uso</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidade</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
      </footer>
    </div>
  );
}