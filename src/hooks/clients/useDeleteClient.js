'use client';

import axios from 'axios';

export default function useDeleteClient() {
  const deleteClient = async (id) => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      return {
        success: true,
        message: res.data.message || 'Cliente eliminado correctamente.',
      };
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Error desconocido',
      };
    }
  };

  return { deleteClient };
}
