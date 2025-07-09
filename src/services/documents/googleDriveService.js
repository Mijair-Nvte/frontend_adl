import axios from 'axios';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const getGoogleDriveStatus = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/system-integrations/status/drive`, getHeaders());
  return res.data;
};

export async function listDriveDocuments(folderId) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/google-drive/list-files/${folderId}`,
    getHeaders() // 👈 Aquí es donde faltaba
  );
  return res.data.files;
}


export const uploadDocument = async (file, folderId, onProgress = () => {}) => {
  const formData = new FormData();
  formData.append('file', file);
  if (folderId) formData.append('folder_id', folderId);

  const token = localStorage.getItem('token');

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/google-drive/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      },
    }
  );

  return res.data.file;
};



export const deleteDocument = async (fileId) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/google-drive/delete-file/${fileId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
