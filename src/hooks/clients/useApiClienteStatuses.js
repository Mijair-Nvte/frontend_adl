'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiClienteStatuses() {
  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [errorStatuses, setErrorStatuses] = useState(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      setLoadingStatuses(true);
      setErrorStatuses(null);

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-statuses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStatuses(res.data);
      } catch (error) {
        setErrorStatuses(error.response?.data?.message || 'Error al obtener los estados del cliente');
        setStatuses([]);
      } finally {
        setLoadingStatuses(false);
      }
    };

    fetchStatuses();
  }, []);

  return { statuses, loadingStatuses, errorStatuses };
}
