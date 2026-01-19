# F.lli Brutti

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```
Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
 
## Panoramica del Progetto

## Obiettivi Funzionali
•	Sistema di autenticazione con gestione ruoli (Amministratore, Dipendente)
•	Richiesta preventivi per servizi NCC tramite wizard multi-step
•	Richiesta preventivi per servizi di Movimento Terra
•	Area personale utente con gestione orari di lavoro
•	Sistema di firma digitale entrata/uscita per i dipendenti
•	Pannello amministrativo per la supervisione delle attività

## Architettura dell'Applicazione
L'applicazione segue un'architettura modulare basata su componenti standalone di Angular, con una chiara separazione delle responsabilità tra pagine, servizi e modelli di dati. La struttura del progetto è organizzata secondo le best practice Angular:
Cartella	Descrizione
src/app/pages	Componenti delle pagine (home, login, preventivi, utente, admin)
src/app/services	Servizi per logica di business e comunicazione API
src/app/models	Interfacce TypeScript per la tipizzazione dei dati
src/app/auth	Guard e interceptor per l'autenticazione
src/app/components	Componenti riutilizzabili (es. Logo)


## Tecnologie Utilizzate

## Framework e Librerie Principali
Tecnologia	Versione	Utilizzo
Angular	21.0.0	Framework principale per lo sviluppo della SPA
TypeScript	5.9.2	Linguaggio di programmazione con tipizzazione statica
PrimeNG	21.0.2	Libreria di componenti UI (button, table, datepicker, toast)
RxJS	7.8.0	Programmazione reattiva e gestione degli stream di dati
jwt-decode	4.0.0	Decodifica dei token JWT per l'autenticazione
@primeuix/themes	2.0.2	Sistema di temi Aura per la personalizzazione grafica
Vitest	4.0.8	Framework per unit testing

## Strumenti di Sviluppo
•	Angular CLI 21.0.4: scaffolding, build e serving dell'applicazione
•	npm 10.9.2: gestione delle dipendenze e package manager
•	SCSS: preprocessore CSS per stili modulari e manutenibili
•	Proxy configuration: per il forwarding delle chiamate API in sviluppo

## Funzionalità Principali
## Sistema di Autenticazione
L'applicazione implementa un sistema di autenticazione completo basato su JWT (JSON Web Token). Il servizio AuthService gestisce login, logout, verifica della validità del token e estrazione delle informazioni utente. Sono definiti due ruoli principali: Admin (codice 1) e Employee (codice 2), che determinano l'accesso a funzionalità differenziate. Un AuthGuard protegge le rotte riservate, mentre un HttpInterceptor aggiunge automaticamente il token Bearer alle richieste API.
## Richiesta Preventivi NCC
Il processo di richiesta preventivo per il servizio NCC è strutturato come un wizard a tre step: selezione del periodo di noleggio con date picker, inserimento delle città di partenza e arrivo, compilazione dei dati personali (nome, cognome, email, telefono) e dettagli aggiuntivi. Il servizio NccQuoteStoreService mantiene lo stato del draft durante la navigazione tra gli step, salvando i dati in localStorage per persistenza.
## Richiesta Preventivi Movimento Terra
Per i servizi di Movimento Terra è disponibile un form singolo che consente l'inserimento dei dati del richiedente (nome, cognome, email, telefono), una descrizione dettagliata dell'intervento richiesto e il caricamento opzionale di foto (fino a 2MB). Il MovimentoTerraQuoteStoreService gestisce il draft del preventivo.
## Area Utente e Gestione Orari
L'area utente (/utente) presenta un'interfaccia differenziata in base al ruolo. Tutti gli utenti autenticati possono visualizzare un orologio in tempo reale e utilizzare il pulsante di firma entrata/uscita. Gli amministratori hanno accesso aggiuntivo a un filtro di ricerca e possono visualizzare gli orari di tutti i dipendenti nella tabella. Il TimeTableService gestisce i dati degli orari di lavoro con supporto per il filtraggio.

## Aspetti Tecnici Rilevanti
## Routing e Lazy Loading
L'applicazione utilizza il lazy loading per ottimizzare le performance, caricando i componenti delle pagine on-demand tramite la funzione loadComponent(). Le rotte sono definite in app.routes.ts e includono: home (/), login (/login), wizard NCC (/ncc, /nccCity, /nccDati), movimento terra (/movimento-terra), area preventivi (/preventivi), area utente (/utente) protetta da AuthGuard, e pagina 404 per rotte non trovate.
## Gestione dello Stato
La gestione dello stato applicativo avviene tramite servizi Angular con pattern store. I servizi NccQuoteStoreService e MovimentoTerraQuoteStoreService implementano un pattern di draft persistente che salva automaticamente in localStorage, permettendo agli utenti di riprendere la compilazione in caso di interruzione. L'AuthService utilizza BehaviorSubject per notificare i cambiamenti dello stato di autenticazione.
## UI/UX Design
L'interfaccia utente è caratterizzata da un design moderno con gradienti e animazioni CSS. La homepage presenta un'animazione "float" sul logo e uno sfondo animato con keyframes. Il menu di navigazione è responsive con hamburger menu per dispositivi mobili. I form utilizzano componenti PrimeNG per un'esperienza coerente, con feedback visivi tramite toast per le operazioni completate.

