import { useEffect, useRef } from 'react';
import createEcho from '@/lib/echo';

export default function useNotificationsChannel(userId, onNotification) {
  const echoRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const echo = createEcho();
    if (!echo) return;

    echoRef.current = echo;

    echo.private(`user.${userId}`)
      .listen('.App\\Events\\NotificationSent', (data) => {
        console.log('[Echo] Notificación recibida:', data);
        onNotification(data);
      });

    return () => {
      if (echoRef.current) {
        echoRef.current.leaveChannel(`private-user.${userId}`);
        echoRef.current.disconnect();
      }
    };
  }, [userId, onNotification]);
}
