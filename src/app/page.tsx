"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="overflow-hidden min-h-screen h-full">
      <div className="flex flex-col h-full">
        <ul className="flex items-center justify-center space-x-4 font-semibold mt-6 text-base">
          <li>
            <Link
              href="/sign-in"
              className={pathname === "/sign-in" ? "text-[#355EAF]" : "text-black"}
            >
              Sign In
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className={pathname === "/" ? "text-[#355EAF]" : "text-black"}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
            href="/about"
            className={pathname === "/about"? "text-[#355EAF]": "text-bla"}
            >
              About Us</Link>
          </li>
        </ul>
        <div className="h-screen flex items-center relative">
          <div className="text-[#11264C] relative z-10 text-left px-6 ml-40 space-y-4 w-full max-w-[50%] break-words">
            <p className="text-[40px] font-bold">
              TEXTO GRANDE GENÉRICO SOBRE O SITE TESTANDO
            </p>
            <p className="text-base mt-2 font-semibold">
              TEXTO MENOR SOBRE O SITE
            </p>
            <button className="mt-4 px-12 py-3 bg-[#355EAF] text-white font-medium rounded-[25px] text-base">
              Começar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
