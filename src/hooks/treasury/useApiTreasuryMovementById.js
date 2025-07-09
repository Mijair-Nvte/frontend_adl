'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiTreasuryMovementById(id) {
  const [data, setData] = useState({
    movement: null,
    clients: [],
    cases: [],
    categories: [],
    payment_methods: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/treasury-movements/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (err) {
        setError('Error al cargar movimiento');
        setData({
          movement: null,
          clients: [],
          cases: [],
          categories: [],
          payment_methods: [],
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { ...data, loading, error };
}
