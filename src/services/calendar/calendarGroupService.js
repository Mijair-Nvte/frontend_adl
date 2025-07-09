import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/calendar-groups`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  Accept: 'application/json',
});

// Obtener todos los grupos
export const fetchCalendarGroups = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeaders() });
  return res.data;
};

// Crear grupo
export const createCalendarGroup = async (data) => {
  const res = await axios.post(API_URL, data, { headers: getAuthHeaders() });
  return res.data;
};

// Actualizar grupo
export const updateCalendarGroup = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
  return res.data;
};

// Eliminar grupo
export const deleteCalendarGroup = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return res.data;
};
