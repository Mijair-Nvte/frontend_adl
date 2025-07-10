"use client";

import { useChatMessages, useSendMessage } from '@/hooks/chat/useApiChat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

export default function ChatWindow({ user }) {
  const { messages, setMessages } = useChatMessages(user?.psid);
  const { send } = useSendMessage();

  const handleNewMessage = async (text) => {
    const newMsg = {
      message_text: text,
      direction: 'out',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    try {
      await send({ psid: user.psid, message: text });
    } catch (err) {
      console.error('Error al enviar el mensaje', err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {user ? (
          messages.map((msg, i) => <MessageBubble key={i} message={msg} />)
        ) : (
          <div className="text-center text-gray-400 mt-20">
            Selecciona una conversación
          </div>
        )}
      </div>
      {user && <ChatInput onSend={handleNewMessage} />}
    </div>
  );
}
