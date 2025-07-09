'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useApiLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const { setToken, loadUser } = useAuthStore.getState(); // Acceso directo a acciones

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { access_token } = response.data;

      // Guardar token en localStorage y Zustand
      localStorage.setItem('token', access_token);
      setToken(access_token);

      // Cargar el usuario autenticado
      await loadUser();

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Credenciales inválidas o error del servidor');
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
}
