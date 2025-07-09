'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiCasesByClientId(clientId, refreshKey = 0) {
  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [errorCases, setErrorCases] = useState(null);

  const fetchCases = async () => {
    setLoadingCases(true);
    setErrorCases(null);

    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}/cases`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      setCases(res.data);
    } catch (error) {
      console.error('Error al obtener los expedientes del cliente:', error);
      setErrorCases(error.response?.data?.message || 'Error desconocido');
      setCases([]);
    } finally {
      setLoadingCases(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchCases();
    }
  }, [clientId, refreshKey]);

  return { cases, loadingCases, errorCases };
}
