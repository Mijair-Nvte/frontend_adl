// hooks/tasks/useApiTasks.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      
      setTasks(res.data);
    } catch (err) {
      console.error('Error al cargar tareas', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, setTasks, loading, fetchTasks };
}
