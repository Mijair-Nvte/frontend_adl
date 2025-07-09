'use client';

import axios from 'axios';

export default function useDeleteCase() {
  const deleteCase = async (id) => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cases/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      return {
        success: true,
        message: res.data.message || 'Expediente eliminado correctamente.',
      };
    } catch (err) {
      console.error('Error al eliminar expediente:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Error desconocido',
      };
    }
  };

  return { deleteCase };
}
