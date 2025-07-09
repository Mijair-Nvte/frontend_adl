'use client';
import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';

export default function useAuthGuard() {
  const { token, loading, loadUser } = useAuthStore();

  useEffect(() => {
    if (!token && typeof window !== 'undefined') {
      const localToken = localStorage.getItem('token');
      if (localToken) {
        useAuthStore.getState().setToken(localToken);
        loadUser(); // <-- solo si hay token
      } else {
        useAuthStore.setState({ loading: false });
      }
    }
  }, [token, loadUser]);

  return useAuthStore();
}
