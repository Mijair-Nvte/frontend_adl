'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiEventById(eventId) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        setEvent(res.data);
      } catch (err) {
        console.error('❌ Error al cargar el evento:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { event, loading };
}
