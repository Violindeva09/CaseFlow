import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { User } from '../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  tokenKey = 'caseflow_token';
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private api: ApiService) {
    const token = this.getToken();
    if (token) {
      // Decode token to get user info (simple decode, in production use jwt-decode library)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUser$.next(payload);
      } catch (e) {
        console.warn('Failed to decode stored token, clearing it', e);
        localStorage.removeItem(this.tokenKey);
        this.currentUser$.next(null);
      }
    }
  }

  register(payload: any) { return this.api.post('auth/register', payload); }

  login(payload: any) {
    return this.api.post('auth/login', payload).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.currentUser$.next(res.user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser$.next(null);
  }

  getToken() { return localStorage.getItem(this.tokenKey); }

  getCurrentUser() { return this.currentUser$.asObservable(); }

  isLoggedIn() { return !!this.getToken(); }

  getAgents() { return this.api.get('auth/agents'); }
}
