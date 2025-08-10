'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  // Não mostrar o layout em páginas de autenticação
  const isAuthPage = pathname?.startsWith('/auth');
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="pt-16">
        {session?.user && <Sidebar />}
        <main className={`${session?.user ? 'md:pl-64' : ''} p-4 sm:p-6 lg:p-8`}>
          {children}
        </main>
      </div>
    </div>
  );
}