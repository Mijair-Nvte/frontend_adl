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

// 🔹 Enviar una invitación
export const sendInvitation = async ({ email, role_id }) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/invitations`,
    { email, role_id },
    getHeaders()
  );
  return res.data;
};


// 🔹 Obtener todas las invitaciones
export const getAllInvitations = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/invitations`,
      getHeaders()
    );

    console.log("📨 Invitaciones recibidas:", res.data); 
    return res.data;

  } catch (error) {
    console.error("❌ Error al obtener las invitaciones:", error); // para ver errores
    return [];
  }
};


// 🔹 Aceptar invitación (opcional si lo quieres usar en registro público)
export const acceptInvitation = async (token, userData) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/invitations/accept`,
    {
      token,
      ...userData,
    }
  );
  return res.data;
};
