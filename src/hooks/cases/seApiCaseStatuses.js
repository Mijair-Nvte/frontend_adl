'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiCaseStatuses() {
  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [errorStatuses, setErrorStatuses] = useState(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      setLoadingStatuses(true);
      setErrorStatuses(null);

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/case-statuses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStatuses(res.data);
      } catch (error) {
        setErrorStatuses(error.response?.data?.message || 'Error al obtener los estados del caso');
        setStatuses([]);
      } finally {
        setLoadingStatuses(false);
      }
    };

    fetchStatuses();
  }, []);

  return { statuses, loadingStatuses, errorStatuses };
}
