import axios from 'axios';

export const updateUserPassword = async (data) => {
  const token = localStorage.getItem('token');

  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );

  return response.data;
};
