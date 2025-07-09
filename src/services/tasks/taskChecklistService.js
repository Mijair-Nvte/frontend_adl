// ✅ Archivo: services/tasks/taskChecklistService.js
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/task-checklist-items`;


export const createChecklistItem = async (data) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateChecklistItem = async (id, data) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const deleteChecklistItem = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
