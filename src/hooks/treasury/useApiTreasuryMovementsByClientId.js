"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiTreasuryMovementsByClientId(clientId, refreshKey = 0) {
  const [movements, setMovements] = useState([]);
  const [loadingMovements, setLoadingMovements] = useState(true);
  const [errorMovements, setErrorMovements] = useState(null);

  const fetchMovements = async () => {
    setLoadingMovements(true);
    setErrorMovements(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}/treasury-movements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
       console.log('Movements data:', res.data);
      setMovements(res.data);
    } catch (error) {
      setErrorMovements(error.response?.data?.message || 'Error desconocido');
      setMovements([]);
    } finally {
      setLoadingMovements(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchMovements();
    }
  }, [clientId, refreshKey]);

  return { movements, loadingMovements, errorMovements, setMovements };
}
