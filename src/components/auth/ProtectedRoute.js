'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { user, token, loading, loadUser } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.replace('/');
    } else if (!user) {
      loadUser();
    }
  }, [token, user, loadUser, router]);

  if (!token || loading || (!user && token)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Verificando sesión...</p>
      </div>
    );
  }

  return children;
}
