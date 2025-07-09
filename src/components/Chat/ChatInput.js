'use client';

import { useState } from 'react';

export default function ChatInput({ user, onSend }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text); // 👈 solo envías el texto
    setText('');
  };

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        className="flex-1 border rounded px-3 py-2"
        placeholder="Escribe tu mensaje..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Enviar
      </button>
    </div>
  );
}
