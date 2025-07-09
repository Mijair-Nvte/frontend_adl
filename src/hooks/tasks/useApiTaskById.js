import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiTaskById(taskId) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // <- nuevo estado

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Respuesta completa:", res); // ← DEBUG
        setTask(res.data);
      } catch (err) {
        setError('Error al cargar la tarea');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  return { task, loading, error };
}
