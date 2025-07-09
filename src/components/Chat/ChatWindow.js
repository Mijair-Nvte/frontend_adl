'use client';

import { useEffect } from 'react';
import { useChatMessages, useSendMessage } from '@/hooks/chat/useApiChat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

export default function ChatWindow({ user }) {
  const { messages, setMessages } = useChatMessages(user?.psid);
  const { send } = useSendMessage();

  const handleNewMessage = async (msgText) => {
    const newMsg = {
      message_text: msgText,
      direction: 'out',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    try {
      await send({ psid: user.psid, message: msgText });
    } catch (err) {
      console.error('No se pudo enviar el mensaje', err);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 p-4 overflow-y-auto">
        {user ? (
          messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-20">
            Selecciona una conversación
          </div>
        )}
      </div>
      {user && <ChatInput user={user} onSend={handleNewMessage} />}
    </div>
  );
}
