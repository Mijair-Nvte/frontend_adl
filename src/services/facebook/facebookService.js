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

// 📡 Obtener estado de conexión con Facebook
export const getFacebookStatus = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/facebook/status`,
    getHeaders()
  );
  return res.data;
};

// 🔌 Desconectar cuenta de Facebook (si lo implementas después)
export const disconnectFacebook = async () => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/facebook/disconnect`,
    getHeaders()
  );
};


// 🔁 Redirigir a OAuth con popup
export const redirectToFacebookOAuth = () => {
  const width = 600;
  const height = 700;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const popup = window.open(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`,
    'Facebook Login',
    `width=${width},height=${height},top=${top},left=${left}`
  );

  if (!popup) {
    alert('Popup bloqueado. Permite ventanas emergentes en tu navegador.');
    return;
  }

  const interval = setInterval(() => {
    if (popup.closed) {
      clearInterval(interval);
      alert('Autenticación completada o cancelada');
    }
  }, 1000);
};
