'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTags() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        // ✅ Transformar formato para el MultiSelect
        const formatted = res.data.map((tag) => ({
          value: tag.id,
          label: tag.label,
          color: tag.color,
        }));

        setTags(formatted);
      } catch (err) {
        console.error('Error al obtener tags:', err);
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  return { tags, loading, error };
}
