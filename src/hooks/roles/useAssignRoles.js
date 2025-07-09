'use client';
import { useState } from 'react';
import { assignRolesToUser } from '@/services/roles/roleService';

export default function useAssignRoles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const assignRoles = async (userId, roles) => {
    setLoading(true);
    setError(null);
    try {
      const res = await assignRolesToUser(userId, roles);
      return res; // Retorna la respuesta (por si quieres mostrar un toast, etc.)
    } catch (err) {
      setError(err.response?.data?.message || 'Error desconocido');
      throw err; // Por si quieres catch en el componente
    } finally {
      setLoading(false);
    }
  };

  return { assignRoles, loading, error };
}
