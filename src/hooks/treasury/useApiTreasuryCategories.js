'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiTreasuryCategories(type = null) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      let url = `${process.env.NEXT_PUBLIC_API_URL}/treasury-categories`;
      if (type) url += `?type=${type}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [type]);

  return { categories, setCategories, fetchCategories, loading, error };
}
