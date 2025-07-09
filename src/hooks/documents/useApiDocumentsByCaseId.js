// src/hooks/documents/useApiDocumentsByCaseId.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function useApiDocumentsByCaseId(caseId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDocuments(res.data))
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  }, [caseId]);

  return { documents, loading };
}
