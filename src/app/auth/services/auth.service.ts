import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export type Credentials = {
  username: string;
  password: string;
}

export type User = {
  name: string;
  cpf: string;
  credentials: Credentials;
}

export type AuthResponse = {
  access_token: string;
  username: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth`, credentials).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify({ username: response.username, role: response.role }));
      })
    );
  }

  isLoggedIn() {
    return !!this.authToken;
  }

  createUser(user: User): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users`, user);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  get authToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
