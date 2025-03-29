"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const pathname = usePathname();

  const scrollToSection = (id) => {
    if (typeof window !== "undefined") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <nav className="flex justify-center space-x-6 font-semibold mt-6 text-base relative z-10">
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
          Sobre Nós
        </button>
      </nav>

      <div className="h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
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
              text-base transition-all duration-300 ease-in-out hover:bg-[#2C4B8B] cursor-pointer">
                Começar
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <section id="section1" className="h-screen flex items-center justify-center bg-gray-100 p-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-3xl font-semibold text-[#355EAF]">Gerencie suas tarefas com facilidade</p>
          <p className="text-lg text-gray-600">
            Com o Lumen, você pode criar listas de tarefas, definir prazos e acompanhar seu progresso em um painel intuitivo.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-r from-[#355EAF] to-[#2C4B8B] text-white">
        <div className="text-center space-y-4 px-10 max-w-3xl mx-auto">
          <p className="text-3xl font-semibold">Colaboração eficiente</p>
          <p className="text-lg">
            Trabalhe em equipe de forma organizada! Compartilhe projetos com colegas, atribua tarefas e mantenha a comunicação centralizada.
          </p>
          <button className="mt-6 px-8 py-3 bg-[#11264C] rounded-full text-lg font-medium transition-all duration-300 ease-in-out hover:bg-[#2C4B8B]">
            Saiba Mais
          </button>
        </div>
      </section>

      {/* Section 3 */}
      <section className="h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bg_section3.png')", 
        }}
      >
        <div className="text-center space-y-6 text-white px-10 max-w-2xl mx-auto">
          <p className="text-4xl font-semibold text-[#355EAF]">Acompanhe seu progresso</p>
          <p className="text-lg text-[#355EAF]">
            Utilize gráficos e relatórios para visualizar o andamento dos seus projetos e melhorar sua produtividade acadêmica.
          </p>
          <button className="mt-6 px-8 py-3 bg-[#355EAF] rounded-full text-lg font-medium transition-all duration-300 ease-in-out hover:bg-[#2C4B8B]">
            Começar Agora
          </button>
        </div>
      </section>
    </div>
  );
}