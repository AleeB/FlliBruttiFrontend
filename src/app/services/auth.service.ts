import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface LoginRequest {
  email: string;
  password: string;
}

type LoginResponse = { token?: string; jwt?: string; accessToken?: string } | string;

interface JwtPayload {
  exp?: number;
  role?: string;
  email?: string;
  username?: string;
  sub?: string;
  [key: string]: unknown;
}

export enum UserRoleCode {
  Admin = 1,
  Employee = 2
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenStorageKey = 'token';
  private readonly loginUrl = '/api/Login';
  private inMemoryToken: string | null = null;
  private authState$ = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<string> {
    const payload: LoginRequest = { email, password };

    return this.http.post<LoginResponse>(this.loginUrl, payload).pipe(
      map((response) => this.extractToken(response)),
      tap((token) => this.storeToken(token)),
      catchError((err) => throwError(() => this.normalizeLoginError(err)))
    );
  }

  logout(): void {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  authStateChanges(): Observable<boolean> {
    return this.authState$.asObservable();
  }

  getToken(): string | null {
    const token = this.inMemoryToken ?? this.getStorage()?.getItem(this.tokenStorageKey);
    if (!token) {
      return null;
    }

    if (this.isTokenExpired(token)) {
      this.clearToken();
      return null;
    }

    return token;
  }

  decode(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  getUserRole(token?: string): string | null {
    const tok = token ?? this.getToken();
    if (!tok) {
      return null;
    }

    const decoded = this.decode(tok);
    return typeof decoded?.role === 'string' ? decoded.role : null;
  }

  getUserIdentity(token?: string): string | null {
    const tok = token ?? this.getToken();
    if (!tok) {
      return null;
    }

    const decoded = this.decode(tok);
    return (
      // prova a ottenere l'identità in vari modi, mail o username o subject
      (typeof decoded?.username === 'string' && decoded.username) ||
      (typeof decoded?.email === 'string' && decoded.email) ||
      (typeof decoded?.sub === 'string' && decoded.sub) ||
      null
    );
  }

  roleCode(token?: string): UserRoleCode {
    const role = this.getUserRole(token);
    return role === 'admin' ? UserRoleCode.Admin : UserRoleCode.Employee;
  }

  private extractToken(response: LoginResponse): string {
    if (typeof response === 'string') {
      return response;
    }

    const token = response.token ?? response.jwt ?? response.accessToken;
    if (!token) {
      throw new Error('Token non presente nella risposta di login.');
    }

    return token;
  }

  private storeToken(token: string): void {
    this.inMemoryToken = token;
    this.getStorage()?.setItem(this.tokenStorageKey, token);
    this.authState$.next(true);
  }

  private clearToken(): void {
    this.inMemoryToken = null;
    this.getStorage()?.removeItem(this.tokenStorageKey);
    this.authState$.next(false);
  }

  private getStorage(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }

  private hasValidToken(): boolean {
    const token = this.inMemoryToken ?? this.getStorage()?.getItem(this.tokenStorageKey);
    if (!token) {
      return false;
    }

    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload?.exp) {
      return false;
    }

    return payload.exp * 1000 <= Date.now();
  }

  private normalizeLoginError(error: unknown): Error {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return new Error('Impossibile raggiungere il server di autenticazione.');
      }
      if (error.status === 401 || error.status === 403) {
        return new Error('Credenziali non valide.');
      }

      const serverMessage =
        typeof error.error === 'string' ? error.error : error.error?.message;
      return new Error(serverMessage || 'Errore di login.');
    }

    return new Error('Errore di login.');
  }
}
