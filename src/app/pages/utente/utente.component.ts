import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TimeTableService } from '../../services/timeTable.service';
import { AuthService, UserRoleCode } from '../../services/auth.service';
import { finalize } from 'rxjs';



@Component({
  selector: 'app-utente',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './utente.component.html',
  styleUrl: './utente.component.scss',
})

export class UtenteComponent implements OnInit, OnDestroy {
  

  constructor(
    public authService: AuthService,
    public timeTableService: TimeTableService,
    private http: HttpClient
  ) {}
  
  // nome utente simulato, da sostituire con dati passati dal backend
  nomeUtente: string = 'Mario Rossi'; 
  isAdmin = false;
  oraFirma: Date = new Date();
  private timerId?: any;
  isEntrata = true;
  isFirmaSubmitting = false;
  private readonly firmaEntryUrl = '/api/v1/Firma/Entry';
  private readonly firmaExitUrl = '/api/v1/Firma/Exit';
  utenteContainer = "utente-container";

  // INIZIALIZZA IL COMPONENTE, IMPOSTA IL RUOLO DELL'UTENTE E AVVIA IL TIMER PER L'OROLOGIO
  // 1 = admin, 2 = employee
  ngOnInit(): void { 
    this.isAdmin = this.authService.roleCode() === UserRoleCode.Admin;
    const identity = this.authService.getUserIdentity();
    if (identity) {
      this.nomeUtente = identity;
    }
    this.syncFirmaStateFromLastFirma();
    this.oraFirma = new Date();
    this.timerId = setInterval(() => {
      this.oraFirma = new Date();
      console.log('Aggiornamento orario firma:', this.oraFirma);
    }, 1000);
  }

  onInput(e : any): void {
    const q = e?.target?.value ?? '';
    this.timeTableService.filterByName(q);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
  
  toggleFirma(): void {
    if (this.isFirmaSubmitting) {
      return;
    }

    const url = this.isEntrata ? this.firmaEntryUrl : this.firmaExitUrl;
    this.isFirmaSubmitting = true;
    this.http
      .post<unknown>(url, null)
      .pipe(finalize(() => (this.isFirmaSubmitting = false)))
      .subscribe({
        next: (response) => {
          const lastFirma = this.extractLastFirma(response);
          if (lastFirma) {
            this.authService.updateLastFirma(lastFirma);
            this.isEntrata = !this.shouldShowExit(lastFirma);
            return;
          }

          this.isEntrata = !this.isEntrata;
        },
        error: () => {
          // ignora: lo stato rimane invariato se la firma fallisce
        }
      });
  }

  private syncFirmaStateFromLastFirma(): void {
    const lastFirma = this.authService.getLastFirma();
    this.isEntrata = !this.shouldShowExit(lastFirma);
  }

  private shouldShowExit(lastFirma: Record<string, unknown> | null): boolean {
    if (!lastFirma) {
      return false;
    }

    const uscita = lastFirma['uscita'];
    return !this.hasFirmaValue(uscita);
  }

  private hasFirmaValue(value: unknown): boolean {
    if (value === null || value === undefined || value === false) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return true;
  }

  private extractLastFirma(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    const record = value as Record<string, unknown>;
    const lastFirma = record['lastFirma'];
    if (lastFirma && typeof lastFirma === 'object' && !Array.isArray(lastFirma)) {
      return lastFirma as Record<string, unknown>;
    }

    if ('entrata' in record || 'uscita' in record) {
      return record;
    }

    return null;
  }

  scaricaOrari(): void {
    // Simulazione del download dei dati
    // Da implementare con funzionalità reali
    alert('Scaricando i dati...');
  }
}
