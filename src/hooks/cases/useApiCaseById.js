'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiCaseById(id, refreshKey = 0) {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCase = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cases/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      setCaseData(res.data);
    } catch (err) {
      console.error('Error al obtener expediente:', err);
      setError(err.response?.data?.message || 'Error desconocido');
      setCaseData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCase();
  }, [id, refreshKey]);

  return { caseData, loading, error, fetchCase };
}
