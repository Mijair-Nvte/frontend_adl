'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import AppLoader from '@/components/ui/AppLoader';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);
  const { user, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  if (loading) {
    return <AppLoader />;
  }

  return (
  <main className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white   rounded-xl">
        {showRegister ? (
          <RegisterForm onSwitchForm={() => setShowRegister(false)} />
        ) : (
          <LoginForm onSwitchForm={() => setShowRegister(true)} />
        )}
      </div>
    </main>
  );
}
