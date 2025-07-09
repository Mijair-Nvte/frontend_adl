// services/taskCommentService.js
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/task-comments`;

export const createTaskComment = async (commentData) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(API_URL, commentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  });
  return res.data.comment;
};


export const deleteTaskComment = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/task-comments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const updateTaskComment = async (id, commentData) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${API_URL}/${id}`, commentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  });
  return res.data.comment;
};

