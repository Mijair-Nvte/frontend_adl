'use client';

import { FaFacebookMessenger, FaGoogleDrive } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import {
  getFacebookStatus,
  redirectToFacebookOAuth,
  disconnectFacebook,
} from '@/services/facebook/facebookService';
import { showToast } from '@/utils/toast';

export default function IntegrationCards() {
  const [facebookConnected, setFacebookConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const listener = (event) => {
      if (event.origin !== process.env.NEXT_PUBLIC_API_URL) return;
      if (event.data?.success && event.data?.source === 'facebook') {
        showToast({
          type: 'success',
          message: '¡Facebook conectado!',
          description: 'La página fue vinculada correctamente.',
        });
        fetchFacebookStatus();
      }
    };

    window.addEventListener('message', listener);
    fetchFacebookStatus();

    return () => window.removeEventListener('message', listener);
  }, []);

  const fetchFacebookStatus = async () => {
    try {
      const res = await getFacebookStatus();
      setFacebookConnected(res.connected);
    } catch (error) {
      console.error('Error al obtener el estado de Facebook:', error);
      showToast({
        type: 'error',
        message: 'Error al obtener estado',
        description: 'No se pudo verificar si la cuenta está conectada.',
      });
    }
  };

  const handleFacebookLogin = () => {
    redirectToFacebookOAuth();
  };

  const handleDisconnectFacebook = async () => {
    if (!confirm('¿Estás seguro de que deseas desconectar Facebook?')) return;
    setLoading(true);
    try {
      await disconnectFacebook();
      setFacebookConnected(false);
      showToast({
        type: 'success',
        message: 'Desconectado exitosamente',
        description: 'Facebook fue desvinculado del CRM.',
      });
    } catch (error) {
      console.error('Error al desconectar Facebook:', error);
      showToast({
        type: 'error',
        message: 'Error al desconectar',
        description: 'No se pudo desconectar la cuenta de Facebook.',
      });
    } finally {
      setLoading(false);
    }
  };

  const integrations = [
    {
      name: 'Facebook Messenger',
      description:
        'Conecta tu página de Facebook para responder mensajes directamente desde el CRM.',
      icon: <FaFacebookMessenger className="text-[#1877F2] w-6 h-6" />,
      connected: facebookConnected,
      button: facebookConnected ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-green-600 text-sm font-medium flex items-center">
            ✅ Conectado
          </span>
          <button
            onClick={handleDisconnectFacebook}
            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Desconectando...' : 'Desconectar'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleFacebookLogin}
          className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 w-fit"
        >
          Conectar
        </button>
      ),
    },
    {
      name: 'Google Drive',
      description:
        'Administra tus carpetas de Google Drive directamente desde tu CRM.',
      icon: <FaGoogleDrive className="text-yellow-500 w-6 h-6" />,
      connected: false,
      button: (
        <button className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 w-fit">
          Conectar
        </button>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {integrations.map((item, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border rounded-xl bg-white shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <div>{item.icon}</div>
            <div>
              <p className="font-semibold text-sm flex items-center gap-2">
                {item.name}
                {item.connected !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      item.connected
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.connected ? 'Conectado' : 'No conectado'}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
            </div>
          </div>
          <div className="flex justify-end">{item.button}</div>
        </div>
      ))}
    </div>
  );
}
