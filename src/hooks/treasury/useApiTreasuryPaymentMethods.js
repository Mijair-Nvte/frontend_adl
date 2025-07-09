'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiTreasuryPaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const url = `${process.env.NEXT_PUBLIC_API_URL}/treasury-payment-methods`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      console.log(response.data)
      setPaymentMethods(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener métodos de pago');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return { paymentMethods, setPaymentMethods, fetchPaymentMethods, loading, error };
}
