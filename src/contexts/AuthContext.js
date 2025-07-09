'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar token y usuario al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((res) => {
       
          setUser(res.data);
        })
        .catch((err) => {
          console.error('Token inválido o expirado', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

const login = async ({ user, token }) => {
  localStorage.setItem('token', token);
  setToken(token);

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(response.data);
   
  } catch (err) {
   
    logout();
  }
};



  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.warn('Error cerrando sesión (puede ser token expirado)', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.clear();
      setToken(null);
      setUser(null);
      router.push('/');
    }
  };




  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
  
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
