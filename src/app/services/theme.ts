import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { addIcons } from 'ionicons';
import { sunny, moon } from 'ionicons/icons';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private rendererFactory = inject(RendererFactory2);
  
  // Estado reativo do tema
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    addIcons({ sunny, moon });
    
    // Inicializa com a preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.setTheme(prefersDark.matches);
  }

  toggleDarkMode() {
    this.setTheme(!this.darkMode.value);
  }

  private setTheme(isDark: boolean) {
    this.darkMode.next(isDark);
    if (isDark) {
      this.renderer.addClass(document.body, 'ion-palette-dark');
    } else {
      this.renderer.removeClass(document.body, 'ion-palette-dark');
    }
  }

  get isDarkMode() {
    return this.darkMode.value;
  }
}