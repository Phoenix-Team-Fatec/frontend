'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserData } from '@/utils/auth';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUserData();
    
    if (!userData) {
      router.push('/sign-in');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#355EAF] animate-spin"></div>
      </div>
    );
  }

  return children;
}