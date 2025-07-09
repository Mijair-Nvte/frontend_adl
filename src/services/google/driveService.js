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


export const redirectToGoogleOAuth = async () => {
  const token = localStorage.getItem('token');
  const service = 'drive';
  const redirectTo = '/dashboard/settings';

  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/google/redirect`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      service,
      redirect_to: redirectTo,
      system: true, // ✅ AQUÍ lo mandas
    },
  });

  return response.data.url;
};


export const revokeGoogleDrive = async () => {
  return await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/system-integrations/revoke/drive`, getHeaders());
};

// 🔹 NUEVO: Obtener carpetas
export const fetchDriveFolders = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/google-drive/folders`, getHeaders());
  return res.data.folders;
};

// 🔹 NUEVO: Establecer carpeta raíz
export const setRootFolder = async (folderId) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/google-drive/set-root-folder`,
    { folder_id: folderId },
    getHeaders()
  );
};