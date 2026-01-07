import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import localeIT from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeIT);

bootstrapApplication(App, {
  // ... copia le altre configurazioni e propietà qua dentro 
  // SENZA SAPERE IN ANTICIPO QUALE SONO
  ...appConfig,  
  providers: [
    ...(appConfig.providers || []),
    // NEL CASO PROVIDERS SIA UNDEFINED, LO TRATTIAMO COME UN ARRAY VUOTO
    { provide: LOCALE_ID, useValue: 'it-IT' }
  ]
})
  .catch((err) => console.error(err));
