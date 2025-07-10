import { useEffect, useRef } from 'react';
import createEcho from '@/lib/echo';

export default function useFacebookChatChannel(psid, onNewMessage) {
  const echoRef = useRef(null);

  useEffect(() => {
    if (!psid) return;

    const echo = createEcho();
    if (!echo) return;

    echoRef.current = echo;

    echo.channel(`facebook.chat.${psid}`)
      .listen('.facebook.message.received', (event) => {
        console.log('[Echo] Mensaje nuevo recibido:', event);
        onNewMessage(event.message);
      });

    return () => {
      if (echoRef.current) {
        echoRef.current.leave(`facebook.chat.${psid}`);
      }
    };
  }, [psid, onNewMessage]);
}
