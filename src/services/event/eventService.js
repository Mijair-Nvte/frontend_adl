import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/events`;

export const createEvent = async (data) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  });
  return res.data;
};

export const updateEvent = async (id, data) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  });
  return res.data;
};

export const deleteEvent = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
};


export const deleteTask = async (id) => {
  const token = localStorage.getItem('token');
    console.log('🗑️ Eliminando tarea con ID:', id); // ✅ DEBUG

  const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
};



//esta funcion sirve para sincroniar gogole calndar hacia mi sistema, pasar los eventos que tengo en mis calendario a mi sistema

export const syncFromGoogle = async () => {
  const token = localStorage.getItem('token');
const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sync-google-events`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
};


export const updateAnyTime = async (type, id, data) => {
  const token = localStorage.getItem('token');
  const baseUrls = {
    event: `${process.env.NEXT_PUBLIC_API_URL}/events`,
    task: `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
  };
  const res = await axios.patch(`${baseUrls[type]}/${id}/time`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  });
  return res.data;
};
