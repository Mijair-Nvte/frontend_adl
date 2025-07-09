import { useState, useEffect } from 'react';
import {
  getConversations,
  getMessagesByPsid,
  sendMessage
} from '@/services/chat/chatService';

export function useChatConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return { conversations, loading, refresh: fetchConversations };
}

export function useChatMessages(psid) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!psid) return;
    try {
      setLoading(true);
      const data = await getMessagesByPsid(psid);
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [psid]);

  return { messages, loading, refresh: fetchMessages, setMessages };
}

export function useSendMessage() {
  const send = async ({ psid, message }) => {
    try {
      return await sendMessage({ psid, message });
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  return { send };
}
