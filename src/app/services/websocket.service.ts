import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket
  private url: string = 'ws://192.168.173.225:81';  // Substitua pelo IP e porta do seu servidor WebSocket
  private messageSubject = new BehaviorSubject<string>('');

  public message$ = this.messageSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      console.log('Message received:', event.data);
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  }

  public sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn('WebSocket is not open. Cannot send message.');
    }
  }
}
