import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginUser {
  type?: number | string;
  name?: string;
  surname?: string;
  email?: string;
}

type LoginResponse =
  | {
      token?: string;
      jwt?: string;
      accessToken?: string;
      type?: number | string;
      user?: LoginUser;
    }
  | string;

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
  private readonly roleStorageKey = 'userType';
  private readonly displayNameStorageKey = 'userDisplayName';
  private readonly loginUrl = '/api/Login';
  private inMemoryToken: string | null = null;
  private inMemoryRoleType?: UserRoleCode | null;
  private inMemoryDisplayName?: string | null;
  private authState$ = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<string> {
    const payload: LoginRequest = { email, password };

    return this.http.post<LoginResponse>(this.loginUrl, payload).pipe(
      map((response) => {
        const token = this.extractToken(response);
        const roleType = this.extractUserType(response);
        const displayName = this.extractUserDisplayName(response);
        this.storeUserType(roleType);
        this.storeUserDisplayName(displayName);
        return token;
      }),
      tap((token) => this.storeToken(token)),
      catchError((err) => throwError(() => this.normalizeLoginError(err)))
    );
  }

  logout(): void {
    this.clearToken();
    // chiama il backend per invalidare la sessione se necessario
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
    const role =
      decoded?.role ??
      decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
    return typeof role === 'string' ? role : null;
  }

  getUserIdentity(token?: string): string | null {
    return this.getUserDisplayName(token);
  }

  getUserDisplayName(token?: string): string | null {
    const stored = this.getStoredUserDisplayName();
    if (stored) {
      return stored;
    }

    const tok = token ?? this.getToken();
    if (!tok) {
      return null;
    }

    const decoded = this.decode(tok);
    const name = this.normalizeNamePart(decoded?.['PersonName']);
    const surname = this.normalizeNamePart(decoded?.['PersonSurname']);
    const fullName = this.buildFullName(name, surname);
    if (fullName) {
      return fullName;
    }

    const username = this.normalizeNamePart(decoded?.username);
    if (username) {
      return username;
    }

    const email =
      this.normalizeNamePart(decoded?.email) ??
      this.normalizeNamePart(
        decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
      );
    if (email) {
      return email;
    }

    return (
      this.normalizeNamePart(decoded?.sub) ??
      this.normalizeNamePart(
        decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      )
    );
  }

  roleCode(token?: string): UserRoleCode {
    const storedType = this.getStoredUserType();
    if (storedType !== null) {
      return storedType;
    }

    const role = this.getUserRole(token);
    const parsedRole = this.parseUserType(role);
    return parsedRole ?? UserRoleCode.Employee;
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

  private extractUserType(response: LoginResponse): UserRoleCode | null {
    if (typeof response === 'string') {
      return null;
    }

    return (
      this.parseUserType(response.type) ?? this.parseUserType(response.user?.type)
    );
  }

  private extractUserDisplayName(response: LoginResponse): string | null {
    if (typeof response === 'string') {
      return null;
    }

    const name = this.normalizeNamePart(response.user?.name);
    const surname = this.normalizeNamePart(response.user?.surname);
    const fullName = this.buildFullName(name, surname);
    if (fullName) {
      return fullName;
    }

    return this.normalizeNamePart(response.user?.email);
  }

  private parseUserType(value: unknown): UserRoleCode | null {
    if (value === undefined || value === null) {
      return null;
    }

    const numeric = typeof value === 'number' ? value : Number(value);
    if (numeric === UserRoleCode.Admin || numeric === UserRoleCode.Employee) {
      return numeric;
    }

    return null;
  }

  private storeToken(token: string): void {
    this.inMemoryToken = token;
    this.getStorage()?.setItem(this.tokenStorageKey, token);
    this.authState$.next(true);
  }

  private clearToken(): void {
    this.inMemoryToken = null;
    this.getStorage()?.removeItem(this.tokenStorageKey);
    this.clearUserType();
    this.clearUserDisplayName();
    this.authState$.next(false);
  }

  private storeUserType(type: UserRoleCode | null): void {
    this.inMemoryRoleType = type;
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    if (type === null) {
      storage.removeItem(this.roleStorageKey);
      return;
    }

    storage.setItem(this.roleStorageKey, String(type));
  }

  private clearUserType(): void {
    this.storeUserType(null);
  }

  private storeUserDisplayName(name: string | null): void {
    const normalized = this.normalizeNamePart(name);
    this.inMemoryDisplayName = normalized;
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    if (!normalized) {
      storage.removeItem(this.displayNameStorageKey);
      return;
    }

    storage.setItem(this.displayNameStorageKey, normalized);
  }

  private clearUserDisplayName(): void {
    this.storeUserDisplayName(null);
  }

  private getStoredUserDisplayName(): string | null {
    if (this.inMemoryDisplayName !== undefined) {
      return this.inMemoryDisplayName;
    }

    const stored = this.getStorage()?.getItem(this.displayNameStorageKey);
    const normalized = this.normalizeNamePart(stored);
    this.inMemoryDisplayName = normalized;
    return normalized;
  }

  private getStoredUserType(): UserRoleCode | null {
    if (this.inMemoryRoleType !== undefined) {
      return this.inMemoryRoleType;
    }

    const stored = this.getStorage()?.getItem(this.roleStorageKey);
    const parsed = stored ? this.parseUserType(stored) : null;
    this.inMemoryRoleType = parsed;
    return parsed;
  }

  private getStorage(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }

  private normalizeNamePart(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  private buildFullName(name: string | null, surname: string | null): string | null {
    if (name && surname) {
      return `${name} ${surname}`;
    }

    return name || surname || null;
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
