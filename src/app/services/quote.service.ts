import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RichiestaPreventivo } from '../models/richiesta-preventivo.model';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  sendByEmail(r: RichiestaPreventivo): Observable<boolean> {
    // TODO: integrate with backend / mail provider
    console.log('send email', r);
    return of(true);
  }

  sendByPhone(r: RichiestaPreventivo): Observable<boolean> {
    // TODO: call phone/SMS provider or log contact
    console.log('phone request', r);
    return of(true);
  }
}
