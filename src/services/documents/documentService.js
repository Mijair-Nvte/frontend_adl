// src/services/documents/documentService.js
import axios from 'axios';

const getToken = () => localStorage.getItem('token');

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

const axiosConfig = () => ({
  headers: getAuthHeaders(),
});

const uploadFile = (url, file, onProgress = () => {}) => {
  const form = new FormData();
  form.append('file', file);
  form.append('title', file.name); // usar como título

  return axios.post(url, form, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (e) =>
      onProgress(Math.round((e.loaded * 100) / e.total)),
  }).then(res => res.data);
};

export const listDocuments = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents`, axiosConfig());
  return res.data;
};

export const deleteDocument = async (id) => {
  const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, axiosConfig());
  return res.data;
};


export const getDocumentsByCaseId = (caseId) => {
  console.log('📁 Obteniendo documentos del expediente con ID:', caseId);
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/documents-list`, axiosConfig())
    .then((res) => res.data)
    .catch((err) => {
      console.error('❌ Error en la petición getDocumentsByCaseId:', err?.response?.data || err.message);
      throw err;
    });
};

export const getDocumentsByTaskId = (taskId) => {
  console.log('📁 Obteniendo documentos de la tarea con ID:', taskId);
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/documents`, axiosConfig())
    .then((res) => res.data)
    .catch((err) => {
      console.error('❌ Error en la petición getDocumentsByTaskId:', err?.response?.data || err.message);
      throw err;
    });
};



export const uploadDocument = async (file, onProgress = () => {}, options = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', file.name);
  formData.append('description', options.description || '');

  if (options.caseId) formData.append('case_id', options.caseId);
  if (options.taskId) formData.append('task_id', options.taskId);

  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/documents`, formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (e) => {
      const percent = Math.round((e.loaded * 100) / e.total);
      onProgress(percent);
    },
  });

  return res.data;
};
