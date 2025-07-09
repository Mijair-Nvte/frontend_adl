// src/services/roles/roleService.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Obtener todos los roles
export const fetchRoles = async () => {
  const res = await axios.get(`${API_URL}/roles`, getHeaders());
  return res.data;
};

// Asignar roles a un usuario (PATCH)
export const assignRolesToUser = async (userId, roles) => {
  const res = await axios.patch(
    `${API_URL}/users/${userId}/assign-roles`,
    { roles }, // debe ser un array de IDs de roles: [1, 2, ...]
    getHeaders()
  );
  return res.data;
};

// (Opcional) Crear, eliminar, editar roles si lo vas a necesitar después
// export const createRole = async (data) => { ... }
// export const updateRole = async (id, data) => { ... }
// export const deleteRole = async (id) => { ... }
