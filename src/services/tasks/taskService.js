import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tasks`;

export const createTask = async (data) => {
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

export const updateTask = async (id, data) => {
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

export const deleteTask = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
};

export const updateTaskStatus = async (taskId, task_status_id) => {
  const token = localStorage.getItem('token');
  const res = await axios.patch(
    `${API_URL}/${taskId}/status`,
    { task_status_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }
  );
  return res.data.task;
};

export const updateTaskOrder = async (tasks) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${API_URL}/reorder`,
    { tasks },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }
  );
  return res.data;
};


export const syncFromGoogleTasks = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sync-google-tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
};

