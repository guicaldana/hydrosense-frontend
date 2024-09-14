import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from '../../environments/environment'
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  
  private messageSource = new BehaviorSubject<any>(null);
  currentMessage = this.messageSource.asObservable();

  constructor(private messaging: Messaging,
              private http: HttpClient
  ) {}

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

  public sendNotification(currentToken: string, accessToken: string): Observable<any> {

    const httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": 'application/json',
        'Authorization': 'Bearer '+ accessToken
			}),
		}
  const message = {
      "message": {
        "token": currentToken,
        "notification": {
          "title": "HydroSense",
          "body": "Alerta de níveis baixos! Possível período de falta dágua em breve"
        }
      }
    }
		return this.http.post(`https://fcm.googleapis.com/v1/projects/hydrosensepushnotif/messages:send`, message, httpOptions);
	}
}
