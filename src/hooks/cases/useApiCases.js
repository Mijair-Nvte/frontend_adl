'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiCases() {
  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [errorCases, setErrorCases] = useState(null);

  const fetchCases = async (filters = {}) => {
    setLoadingCases(true);
    setErrorCases(null);

    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cases`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        params: filters,
      });
  
      setCases(res.data);
    } catch (error) {
      console.error('Error al obtener los expedientes:', error);
      setErrorCases(error.response?.data?.message || 'Error desconocido');
    } finally {
      setLoadingCases(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return { cases, setCases, loadingCases, errorCases, fetchCases };
}
