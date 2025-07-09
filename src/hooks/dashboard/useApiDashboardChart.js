import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApiDashboardChart(year) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!year) return;

    const token = localStorage.getItem('token'); // Asegúrate de guardar el token en localStorage cuando el usuario inicie sesión

    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/chart-by-year`, {
      params: { year },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then((res) => {
        setChartData(res.data);
        setError(null);
      })
      .catch(() => {
        setError('Error al cargar los datos');
        setChartData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [year]);

  return { chartData, loading, error };
}
