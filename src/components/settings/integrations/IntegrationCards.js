'use client';

import { CheckCircle, Link as LinkIcon } from 'lucide-react';
import { FaFacebookMessenger, FaGoogleDrive } from 'react-icons/fa';

export default function IntegrationCards() {
  const integrations = [
    {
      name: 'Facebook Messenger',
      description: 'Conecta tu página de Facebook para responder mensajes directamente desde el CRM.',
      icon: <FaFacebookMessenger className="text-[#1877F2] w-6 h-6" />,
      connected: false, // cambia a true si ya tienes token guardado
      button: (
        <a
          href="https://6863-148-222-132-78.ngrok-free.app/api/v1/auth/facebook"
          className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Conectar
        </a>
      ),
    }
    ,
    {
      name: 'Google Drive',
      description: 'Administra tus carpetas de Google Drive directamente desde tu CRM.',
      icon: <FaGoogleDrive className="text-yellow-500 w-6 h-6" />,
      connected: false,
      button: (
        <button className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
          Conectar
        </button>
      ),
    },
    // Puedes agregar más integraciones aquí (Stripe, WhatsApp, etc.)
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {integrations.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 border rounded-lg bg-white "
        >
          <div className="flex items-start gap-4">
            <div className="mt-1">{item.icon}</div>
            <div>
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
            </div>
          </div>
          <div>{item.button}</div>
        </div>
      ))}
    </div>
  );
}
