import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://192.168.173.226:5000');
    this.socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Erro de conexão ao servidor Socket.IO:', err);
    });
  }

  

  public sendMessage(message: string) {
    this.socket.emit('message', message);
    console.log('Message sent');
  }

  public onMessage() {
    return new Observable(observer => {
      this.socket.on('sensorData', (msg: string) => {
        console.log('Mensagem recebida do servidor:', msg); // Debug
        observer.next(msg);
      });
    });
  }
}