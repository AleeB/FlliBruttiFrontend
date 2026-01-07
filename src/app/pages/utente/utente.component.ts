import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface OrarioLavoro {
  data: Date;
  oraEntrata: string;
  oraUscita: string;
  oreLavorate: number;
  tipo: 'Ufficio' | 'Smart Working' | 'Ferie';
  note?: string;
}

@Component({
  selector: 'app-utente',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './utente.component.html',
  styleUrl: './utente.component.scss',
})
export class UtenteComponent implements OnInit, OnDestroy {

  orariFiltrati: OrarioLavoro[] = [
    { 
      data: new Date(2026, 0, 5),
      oraEntrata: '09:00',
      oraUscita: '18:00',
      oreLavorate: 8,
      tipo: 'Ufficio',
      note: 'Progetto Alpha'
    },
    {
      data: new Date(2026, 0, 6),
      oraEntrata: '08:30',
      oraUscita: '17:30',
      oreLavorate: 8,
      tipo: 'Smart Working',
      note: 'Meeting cliente'
    },
    {
      data: new Date(2026, 0, 7),
      oraEntrata: '-',
      oraUscita: '-',
      oreLavorate: 0,
      tipo: 'Ferie',
      note: 'Ferie invernali'
    }
  ];
  
  nomeUtente = 'Mario Rossi';
  oraFirma = new Date();
  private timerId?: any;
  isEntrata = true;

  ngOnInit(): void { 
    this.oraFirma = new Date();
    this.timerId = setInterval(() => {
      this.oraFirma = new Date();
    }, 1000);
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
    alert('Scaricando i dati...');
  }
}
