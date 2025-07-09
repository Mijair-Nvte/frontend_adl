import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/reports/advanced`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

export default function useApiReports() {
  const [kpis, setKpis] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async (filters = {}) => {
    try {
      setLoading(true);

      const params = {};
      if (filters.from) params.from = filters.from.toISOString().split("T")[0];
      if (filters.to) params.to = filters.to.toISOString().split("T")[0];

      const res = await axios.get(API_URL, {
        headers: getAuthHeaders(),
        params,
      });

      console.log("✅ Datos recibidos:", res.data);

      setKpis(res.data.kpis || {});
      setData(res.data.chart || []);
      setError(null);
    } catch (err) {
      console.error("❌ Error al obtener reportes:", err.response || err.message || err);
      setError("Error al obtener reportes");
      setKpis(null);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🟡 Llamada automática al montar con fechas del mes actual
  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    fetchReports({ from: startOfMonth, to: endOfMonth });
  }, [fetchReports]);

  return { kpis, data, loading, error, refetch: fetchReports };
}
