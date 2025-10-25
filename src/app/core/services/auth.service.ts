// ===============================================
// FILE: src/app/core/services/auth.service.ts
// ===============================================
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../env/environments';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check token validity on init
    if (this.hasToken()) {
      this.validateToken();
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    // In production, replace this with actual API call
    // return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
    
    // Mock implementation for demo
    return new Observable<LoginResponse>(observer => {
      // Simulate API delay
      setTimeout(() => {
        if (email === 'admin@queagent.nl' && password === 'admin') {
          const response: LoginResponse = {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: '1',
              email: email,
              role: 'admin'
            }
          };
          observer.next(response);
          observer.complete();
        } else {
          observer.error({ error: { message: 'Invalid credentials' } });
        }
      }, 500);
    }).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  private validateToken(): void {
    // In production, validate token with backend
    // this.http.get(`${environment.apiUrl}/auth/validate`).subscribe()
    
    const token = this.getToken();
    if (!token) {
      this.isAuthenticatedSubject.next(false);
    }
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
