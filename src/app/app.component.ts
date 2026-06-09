// import { Component, inject } from '@angular/core';
// import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
// import { ThemeService } from './services/theme';

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   standalone: true,
//   imports: [IonApp, IonRouterOutlet],
// })
// export class AppComponent {
//   // Apenas injetar o service já dispara o constructor dele e aplica o tema
//   private themeService = inject(ThemeService);
//   constructor() {}
// }

import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { ThemeService } from './services/theme';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private platform = inject(Platform); // Injeta o detetor de plataforma

  constructor() {}

  async ngOnInit() {
    // Pede permissão apenas se estiver a correr nativamente num telemóvel (Android/iOS)
    if (this.platform.is('capacitor')) {
      try {
        await LocalNotifications.requestPermissions();
      } catch (error) {
        console.error('Permissão de notificação negada ou erro:', error);
      }
    }
  }
}