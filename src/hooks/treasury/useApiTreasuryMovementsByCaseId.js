"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiTreasuryMovementsByCaseId(caseId, refreshKey = 0) {
  const [movements, setMovements] = useState([]);
  const [loadingMovements, setLoadingMovements] = useState(true);
  const [errorMovements, setErrorMovements] = useState(null);

  const fetchMovements = async () => {
    setLoadingMovements(true);
    setErrorMovements(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/treasury/movements/by-case/${caseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      setMovements(res.data);
    } catch (error) {
      setErrorMovements(error.response?.data?.message || 'Error desconocido');
      setMovements([]);
    } finally {
      setLoadingMovements(false);
    }
  };

  useEffect(() => {
    if (caseId) {
      fetchMovements();
    }
  }, [caseId, refreshKey]);

  return { movements, loadingMovements, errorMovements, setMovements };
}
