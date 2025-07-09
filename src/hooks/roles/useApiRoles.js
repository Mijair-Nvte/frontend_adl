'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiRoles() {
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [errorRoles, setErrorRoles] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      setErrorRoles(null);

      try {
        const token = localStorage.getItem('token');
        console.log('Token enviado:', token);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/roles`;
        console.log('Endpoint solicitado:', url);

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        console.log('Respuesta de roles:', res.data);
        setRoles(res.data);
      } catch (error) {
        if (error.response) {
          // El backend respondió con un código de error
          console.error('Error en backend:', error.response.status, error.response.data);
          setErrorRoles(
            (error.response.data && error.response.data.message) ||
            `Error en backend: ${error.response.status}`
          );
        } else {
          // Error de red o en el frontend
          console.error('Error en petición:', error.message);
          setErrorRoles(error.message || 'Error desconocido');
        }
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  return { roles, loadingRoles, errorRoles };
}
