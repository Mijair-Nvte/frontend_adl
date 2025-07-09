'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/clients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          params: filters,
        }
      );

      setClients(response.data);
    } catch (err) {
      console.error('Error al obtener clientes:', err);
      setError(err.response?.data?.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, setClients, fetchClients, loading, error };
}
