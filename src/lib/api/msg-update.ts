import { useEffect, useState } from 'react';
import { apiService } from './api';

class MsgUpdateService {
  private webSocket: WebSocket | null = null;
  private webSocketStatus: 'connecting' | 'open' | 'closed' | 'error' | null = null;
  private subscribers: ((data: any) => void)[] = [];

  getWebSocketStatus() {
    return this.webSocketStatus;
  }

  subscribe(callback: (data: any) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  async webSocketStart() {
    if (this.webSocket && this.webSocketStatus === 'open') {
      return;
    }

    try {
      const socketData = await apiService.socketStart(['telegram.earthquake', 'eew.forecast']);
      
      const wsUrl = socketData.url || (socketData as any).websocket?.url;
      
      if (!wsUrl) {
        throw new Error('WebSocket URL not found in response');
      }
      
      this.webSocket = new WebSocket(wsUrl);
      this.webSocketStatus = 'connecting';

      this.webSocket.onopen = () => {
        this.webSocketStatus = 'open';
      };

      this.webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.subscribers.forEach(subscriber => subscriber(data));
      };

      this.webSocket.onclose = () => {
        this.webSocketStatus = 'closed';
      };

      this.webSocket.onerror = () => {
        this.webSocketStatus = 'error';
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.webSocketStatus = 'error';
    }
  }

  webSocketClose() {
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
  }
}

export const msgUpdateService = new MsgUpdateService();
