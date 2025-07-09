'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Toaster } from 'sonner';
import useAuthStore from '@/store/authStore';
import useSidebarStore from '@/store/sidebarStore';
import AppLoader from '@/components/ui/AppLoader';


export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { token, user, loading, initializeAuth } = useAuthStore();
  const expanded = useSidebarStore((s) => s.expanded);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!loading && !token) {
      router.replace('/');
    }
  }, [loading, token, router]);

  if (loading) {
    return <AppLoader />;
  }

  if (!token) return null;

  return (
    <>
      <Toaster position="bottom-center" />
      <div
        className="flex h-screen bg-cover bg-center"

      >
        <Sidebar />
        <div className="flex flex-col flex-1   transition-all duration-200">
          <Header />
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}