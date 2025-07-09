// hooks/cases/useApiCasesModal.js
'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';

export default function useApiCasesModal() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cases`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const formatted = res.data.map((c) => ({
        label: `${c.case_number || ''} - ${c.title}`,
        value: c.id,
      }));

      setOptions(formatted);
    } catch (err) {
      console.error('❌ Error al obtener expedientes para el modal', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    options,
    loading,
    fetchCases,
  };
}
