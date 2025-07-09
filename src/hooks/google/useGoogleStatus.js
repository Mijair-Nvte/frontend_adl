'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useGoogleStatus() {
  const [isLinked, setIsLinked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoogleStatus = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/google-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );

        setIsLinked(response.data.linked);
      } catch (error) {
        console.error('❌ Error al verificar Google Status:', error);
        setIsLinked(false);
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleStatus();
  }, []);

  return { isLinked, loading };
}
