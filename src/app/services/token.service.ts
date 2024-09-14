import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private apiUrl = 'http://localhost:3000/get-token'; // URL do backend

  constructor(private http: HttpClient) { }

  getAccessToken(): Observable<{ accessToken: string }> {
    return this.http.get<{ accessToken: string }>(this.apiUrl);
  }
}
