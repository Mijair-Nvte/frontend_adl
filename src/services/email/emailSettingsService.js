import axios from 'axios';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// 🔹 Obtener configuración
export const getEmailSettings = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mail-settings`, getHeaders());
  return res.data;
};

// 🔹 Actualizar configuración
export const updateEmailSettings = async (data) => {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/mail-settings`, data, getHeaders());
  return res.data;
};
