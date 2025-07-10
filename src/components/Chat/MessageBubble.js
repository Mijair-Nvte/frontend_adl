"use client";

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MessageBubble({ message }) {
  const isSent = message.direction === 'out';
  const time = format(new Date(message.timestamp), 'HH:mm', { locale: es });

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-xl shadow-sm text-sm ${
          isSent
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <div>{message.message_text}</div>
        <div className="text-[10px] text-right opacity-60">{time}</div>
      </div>
    </div>
  );
}
