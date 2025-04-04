import Link from "next/link";
import React from "react";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        <nav className="p-4 bg-gray-800 text-white flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/Dashboard">Dashboard</Link>
          <Link href="/projetos">Projetos</Link>
          <Link href="/tasks">Tarefas</Link>
        </nav>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
