import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * Skeleton AuthService: login returns a fake JWT with custom claims.
 * Replace with real HTTP calls to your backend.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  login(username: string, password: string): Observable<string> {
    // In real app call HTTP endpoint that returns a JWT.
    const fakeToken = this.createFakeJwt({ sub: '1', role: 'admin', permissions: ['manage:all'] });
    return of(fakeToken);
  }

  private createFakeJwt(claims: Record<string, any>): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { ...claims, iat: Math.floor(Date.now() / 1000) };
    function b64(obj: any) { return btoa(JSON.stringify(obj)).replace(/=/g,''); }
    return `${b64(header)}.${b64(payload)}.signature`;
  }

  decode(token: string) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}
