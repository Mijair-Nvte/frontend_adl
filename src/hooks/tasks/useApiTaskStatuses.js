'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiTaskStatuses() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatuses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/task-statuses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setStatuses(res.data);
    } catch (err) {
      console.error('Error al obtener estatus de tareas', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  return { statuses, loading, error };
}
