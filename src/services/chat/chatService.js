import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/chat'; // asegúrate de tener esto en .env

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const getConversations = async () => {
  const res = await axios.get(`${API_URL}/conversations`, getHeaders());
  return res.data;
};

export const getMessagesByPsid = async (psid) => {
  const res = await axios.get(`${API_URL}/conversations/${psid}`, getHeaders());
  return res.data;
};

export const sendMessage = async ({ psid, message }) => {
  if (!psid || !message) throw new Error('PSID o mensaje faltante');
  const res = await axios.post(`${API_URL}/send`, { psid, message }, getHeaders());
  return res.data;
};


