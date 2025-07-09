import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/clients`;

export const createClient = async (data) => {
  const token = localStorage.getItem('token');

  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return res.data;
};

export const updateClient = async (id, data) => {
  const token = localStorage.getItem('token');

  const res = await axios.patch(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return res.data;
};


export const updateClientStatus = async (id, client_status_id) => {
  const token = localStorage.getItem("token");
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/clients/${id}/status`,
    { client_status_id: Number(client_status_id) }, // <- correctamente nombrado
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res.data.client;
};

