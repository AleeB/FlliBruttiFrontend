import { Injectable } from "@angular/core";

interface OrarioLavoro {
  data: Date;
  oraEntrata: string;
  oraUscita: string;
  oreLavorate: number;
  nome: string;
  tipo: 'Movimento Terra' | 'Conducente' | 'Ufficio' | 'Smart Working' | 'Ferie';
  note?: string;
}

@Injectable({
  providedIn: 'root'
})


export class TimeTableService {
  private allOrari: OrarioLavoro[] = [
  { 
    data: new Date(2026, 0, 4),
    oraEntrata: '10:00',
    oraUscita: '19:00',
    oreLavorate: 8,
    nome: 'Mario Rossi',
    tipo: 'Movimento Terra',
    note: 'Movimento terra urgente'
  },
  { 
    data: new Date(2026, 0, 5),
    oraEntrata: '09:00',
    oraUscita: '18:00',
    oreLavorate: 8,
    nome: 'Luigi Bianchi',
    tipo: 'Movimento Terra',
    note: 'Movimento terra urgente'
  },
  {
    data: new Date(2026, 0, 6),
    oraEntrata: '08:30',
    oraUscita: '17:30',
    oreLavorate: 8,
    nome: 'Maria Verdi',
    tipo: 'Smart Working',
    note: 'Lavoro da casa'
  },
  {
    data: new Date(2026, 0, 7),
    oraEntrata: '-',
    oraUscita: '-',
    oreLavorate: 0,
    nome: 'Mario Rossi',
    tipo: 'Ferie',
    note: 'Ferie invernali'
  }
  ];

  // lista filtrata mostrata all'utente
  // inizialmente contiene tutti gli orari
  orariFiltrati: OrarioLavoro[] = [...this.allOrari];

  // FILTRA GLI ORARI IN BASE AL NOME FORNITO DALL'UTENTE NEL CAMPO DI RICERCA 
  // trim() rimuove gli spazi bianchi iniziali e finali, toLowerCase() rende la ricerca case-insensitive
  // Se la query è vuota, ripristina la lista completa
  // Altrimenti filtra gli orari confrontando il nome in minuscolo con la query già in minuscolo
  filterByName(query: string): void {
  const q = (query || '').trim().toLowerCase();
  if (!q) {
    this.orariFiltrati = [...this.allOrari];
    return;
  }
  this.orariFiltrati = this.allOrari.filter(o => o.nome.toLowerCase().includes(q));
  }
}