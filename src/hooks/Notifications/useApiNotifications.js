import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApiNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');


      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });


      setNotifications(res.data);
    } catch (err) {
      console.error('❌ Error al cargar notificaciones', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

 return { notifications, loading, fetchNotifications, setNotifications };

}
