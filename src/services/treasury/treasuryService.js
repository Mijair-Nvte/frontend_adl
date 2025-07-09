// services/treasury/treasuryService.js

import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/treasury-movements`;
const API_FILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/treasury-files`;

export const getTreasuryMovements = async (filters = {}) => {
  const token = localStorage.getItem("token");
  return await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
     params: filters,
  });
};

export const createTreasuryMovement = async (data) => {
  const token = localStorage.getItem("token");
  return await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateTreasuryMovement = async (id, data) => {
  const token = localStorage.getItem("token");
  return await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTreasuryMovement = async (id) => {
  const token = localStorage.getItem("token");
  return await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// SUBIR archivo adjunto
// SUBIR archivo adjunto con logs y try/catch
export const uploadTreasuryFile = async ({ movementId, file }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("treasury_movement_id", movementId);

  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(`${API_FILE_URL}/create-file`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Respuesta del backend:", res.data);
    return res.data;
  } catch (err) {
    // Loguea el error completo para debug
    if (err.response) {
      console.error("Error de backend:", err.response.data);
      throw new Error(err.response.data.message || "Error al subir archivo (backend)");
    } else {
      console.error("Error general:", err);
      throw new Error("Error al subir archivo (general)");
    }
  }
};


// LISTAR archivos de un movimiento
export const getTreasuryFiles = async (movementId) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_FILE_URL}/movement/${movementId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.files;
};

// ELIMINAR archivo
export const deleteTreasuryFile = async (fileId) => {
  const token = localStorage.getItem("token");
  return await axios.delete(`${API_FILE_URL}/${fileId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ACTUALIZAR archivo (opcional)
export const updateTreasuryFile = async (fileId, data) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  if (data.file) formData.append("file", data.file);
  if (data.original_name) formData.append("original_name", data.original_name);

  return await axios.post(`${API_FILE_URL}/treasury-files/${fileId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};