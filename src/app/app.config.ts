import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

// CONFIGURACIÓN GLOBAL (parecido a las clases @Configuration de Spring).
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding(): los parámetros de la URL (:id, ?tipo=) llegan
    // directo como input() del componente, igual que @PathParam / @QueryParam en Jersey.
    provideRouter(routes, withComponentInputBinding()),
    // Habilita HttpClient para poder consumir la API REST.
    provideHttpClient(),
  ],
};
