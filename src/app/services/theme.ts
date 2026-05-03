import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Usamos um Signal para que todas as páginas saibam o estado atual
  darkMode = signal(false);

  constructor() {
    // Verifica preferência do sistema ao iniciar
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.setDarkMode(prefersDark.matches);
  }

  setDarkMode(isDark: boolean) {
    this.darkMode.set(isDark);
    if (isDark) {
      document.body.classList.add('ion-palette-dark');
    } else {
      document.body.classList.remove('ion-palette-dark');
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkMode());
  }
}