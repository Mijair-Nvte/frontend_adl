// hooks/treasury/useApiTreasuryMovements.js
import { useState, useEffect } from "react";
import { getTreasuryMovements } from "@/services/treasury/treasuryService";

export default function useApiTreasuryMovements() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovements = async (filters = {})  => {
    setLoading(true);
    try {
      const res = await getTreasuryMovements(filters);
      setMovements(res.data.data || res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  return { movements, setMovements, fetchMovements, loading, error };
}
