'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MessageBubble({ message }) {
  const isSent = message.direction === 'out';

  const time = message.timestamp
    ? format(new Date(message.timestamp), 'HH:mm', { locale: es })
    : '';

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div
        className={`max-w-[70%] rounded-xl shadow-md ${
          isSent
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}
      >
        <div className="px-4 pt-2 pb-1 break-words whitespace-pre-wrap text-sm">
          {message.message_text}
        </div>
        <div
          className={`px-4 pb-2 text-[10px] text-right ${
            isSent ? 'text-white/70' : 'text-gray-500'
          }`}
        >
          {time}
        </div>
      </div>
    </div>
  );
}
