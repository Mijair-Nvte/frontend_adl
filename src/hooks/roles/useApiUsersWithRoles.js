'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export default function useApiUsersWithRoles() {
  const [usersWithRoles, setUsersWithRoles] = useState([]);
  const [loadingUsersWithRoles, setLoadingUsersWithRoles] = useState(true);
  const [errorUsersWithRoles, setErrorUsersWithRoles] = useState(null);

  // OJO: con useCallback evitas crear una nueva función en cada render
  const fetchUsersWithRoles = useCallback(async () => {
    setLoadingUsersWithRoles(true);
    setErrorUsersWithRoles(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users-with-roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      setUsersWithRoles(res.data);
    } catch (error) {
      console.error('Error al obtener usuarios con roles:', error);
      setErrorUsersWithRoles(error.message || 'Error desconocido');
    } finally {
      setLoadingUsersWithRoles(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchUsersWithRoles();
  }, [fetchUsersWithRoles]);

  // Expones la función para volver a cargar manualmente
  return {
    usersWithRoles,
    loadingUsersWithRoles,
    errorUsersWithRoles,
    refetch: fetchUsersWithRoles,
  };
}
