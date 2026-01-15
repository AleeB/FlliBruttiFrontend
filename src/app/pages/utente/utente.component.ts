import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TimeTableService } from '../../services/timeTable.service';
import { AuthService, UserRoleCode } from '../../services/auth.service';



@Component({
  selector: 'app-utente',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './utente.component.html',
  styleUrl: './utente.component.scss',
})

export class UtenteComponent implements OnInit, OnDestroy {
  

  constructor (public authService: AuthService, public timeTableService: TimeTableService) {}
  
  // nome utente simulato, da sostituire con dati passati dal backend
  nomeUtente: string = 'Mario Rossi'; 
  isAdmin = false;
  oraFirma: Date = new Date();
  private timerId?: any;
  isEntrata = true;
  utenteContainer = "utente-container";

  // INIZIALIZZA IL COMPONENTE, IMPOSTA IL RUOLO DELL'UTENTE E AVVIA IL TIMER PER L'OROLOGIO
  // 1 = admin, 2 = employee
  ngOnInit(): void { 
    this.isAdmin = this.authService.roleCode() === UserRoleCode.Admin;
    const identity = this.authService.getUserIdentity();
    if (identity) {
      this.nomeUtente = identity;
    }
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
    this.isEntrata = !this.isEntrata;
  }

  scaricaOrari(): void {
    // Simulazione del download dei dati
    // Da implementare con funzionalità reali
    alert('Scaricando i dati...');
  }
}
