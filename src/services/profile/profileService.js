import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/profile`;

export const updateMyProfile = async (data) => {
  const token = localStorage.getItem('token');

  const res = await axios.post(`${API_URL}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};
