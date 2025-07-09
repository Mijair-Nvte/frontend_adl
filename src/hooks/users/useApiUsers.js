'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiUsers() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);

      try {
        const token = localStorage.getItem('token');

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        setUsers(res.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        setErrorUsers(error.message || 'Error desconocido');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loadingUsers, errorUsers };
}
