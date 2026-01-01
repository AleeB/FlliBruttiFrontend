import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      ripple: true,
      inputVariant: 'filled',
      overlayAppendTo: 'body',
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false
        }
      },
      zIndex: { modal: 1100, overlay: 1000, menu: 1000, tooltip: 1100 }
    })
    , provideRouter(routes)
  ]
};
