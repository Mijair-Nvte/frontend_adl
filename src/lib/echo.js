import Echo from 'laravel-echo';
import Pusher from 'pusher-js';



export default function createEcho() {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('⚠️ No se encontró token en localStorage. Echo no se inicializa.');
    return null;
  }

  const echoInstance = new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: true,
    encrypted: true, // Ya no es necesario si usas forceTLS:true
    authEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    }
  });


  return echoInstance;
}
