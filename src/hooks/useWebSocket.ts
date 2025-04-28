import { useState, useEffect } from 'react';
import { msgUpdateService } from '../lib/api/msg-update';

export function useWebSocket() {
  const [status, setStatus] = useState<string | null>(null);
  const [telegrams, setTelegrams] = useState<any[]>([]);

  useEffect(() => {
    setStatus(msgUpdateService.getWebSocketStatus());

    const unsubscribe = msgUpdateService.subscribe((data) => {
      setTelegrams(prev => [...prev, data]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    status: msgUpdateService.getWebSocketStatus(),
    start: () => msgUpdateService.webSocketStart(),
    close: () => msgUpdateService.webSocketClose(),
    telegrams
  };
}
