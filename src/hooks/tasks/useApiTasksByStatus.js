// useApiTasksByStatus.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApiTasksByStatus(statusValue) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!statusValue) return;
    const fetchTasks = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/status/${statusValue}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      setLoading(false);
    };

    fetchTasks();
  }, [statusValue]);

  return { tasks, loading };
}
