import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from '../../environments/environment'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  
  private messageSource = new BehaviorSubject<any>(null);
  currentMessage = this.messageSource.asObservable();

  constructor(private messaging: Messaging) {}

  requestPermission() {
    getToken(this.messaging, {
      vapidKey: environment.firebase.vapidKey,
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Token de notificação:', currentToken);
          // Envie o token para o servidor se necessário
        } else {
          console.log('Nenhum token disponível. Solicite permissão para gerar um.');
        }
      })
      .catch((err) => {
        console.log('Erro ao obter token:', err);
      });
  }

  receiveMessage() {
    onMessage(this.messaging, (payload) => {
      console.log('Mensagem recebida. ', payload);
      this.messageSource.next(payload);
    });
  }
}
