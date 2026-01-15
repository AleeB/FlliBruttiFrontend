import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface QuoteEmailPayload {
  to: string;
  subject: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class QuoteService {
  sendByEmail(payload: QuoteEmailPayload): Observable<boolean> {
    const mailto = this.buildMailtoUrl(payload);
    if (typeof window !== 'undefined') {
      window.location.href = mailto;
    }
    return of(true);
  }

  sendByPhone(payload: unknown): Observable<boolean> {
    // TODO: call phone/SMS provider or log contact
    console.log('phone request', payload);
    return of(true);
  }

  private buildMailtoUrl(payload: QuoteEmailPayload): string {
    const to = encodeURIComponent(payload.to);
    const subject = encodeURIComponent(payload.subject);
    const body = encodeURIComponent(payload.body);
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }
}
