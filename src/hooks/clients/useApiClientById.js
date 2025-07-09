'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiClientById(id, refreshKey = 0) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem('token');

    setLoading(true);
    setError(null);

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      .then((res) => setClient(res.data))
      .catch((err) => {
        console.error('Error al obtener cliente:', err);
        setError(err.response?.data?.message || 'Error desconocido');
        setClient(null);
      })
      .finally(() => setLoading(false));
  }, [id, refreshKey]);

  return { client, loading, error };
}
