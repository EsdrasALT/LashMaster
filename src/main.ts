import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router'; // Importação limpa
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// --- IMPORTAÇÕES DO FIREBASE ---
import { environment } from './environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// --- IMPORTAÇÕES DO PWA ---
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),

    // --- INICIALIZAÇÃO DO FIREBASE ---
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    provideFirestore(() => getFirestore()), 
    
    // --- INICIALIZAÇÃO DO PWA / SERVICE WORKER ---
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:5000'
    }),
  ],
}).catch(err => console.error(err));