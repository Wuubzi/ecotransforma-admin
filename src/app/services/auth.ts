import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/loginRequest';
import { AuthResponse } from '../interfaces/authResponse';
import { TokenStorageService } from '../storage/localStorage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login-admin`, data);
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getItem('access_token');
  }

  logout() {
    this.tokenStorage.removeItem('access_token');
  }
}
