"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function useApiTasksByCaseId(caseId, refreshKey = 0) {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState(null);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    setErrorTasks(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks-by-case/${caseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setTasks(res.data);
    } catch (error) {
      setErrorTasks(error.response?.data?.message || "Error desconocido");
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (caseId) fetchTasks();
    // eslint-disable-next-line
  }, [caseId, refreshKey]);

  return { tasks, loadingTasks, errorTasks, setTasks };
}
