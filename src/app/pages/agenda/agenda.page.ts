// src/app/pages/agenda/agenda.page.ts
import { Component, inject, NgZone } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, 
  IonIcon, IonButtons, IonButton, IonText, IonList, IonItem, IonLabel,
  IonFab, IonFabButton, IonItemSliding, IonItemOptions, IonItemOption,
  ModalController 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { add, checkmarkCircle, alertCircle, trash, moon, sunny } from 'ionicons/icons';
import { InventarioService } from '../../services/inventario';
import { AgendamentosService } from '../../services/agendamentos';
import { ThemeService } from '../../services/theme';
import { WeatherService } from '../../services/weather.service';
import { NativeToastService } from '../../services/native-toast.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonButtons, IonButton, IonIcon, IonText, IonList, IonItem, IonLabel,
    IonFab, IonFabButton,
    IonItemSliding, IonItemOptions, IonItemOption  // necessários para swipe-to-delete
  ]
})
export class AgendaPage {
  private invService    = inject(InventarioService);
  private modalCtrl     = inject(ModalController);
  private agendaService = inject(AgendamentosService);
  private weatherService = inject(WeatherService);
  private toast         = inject(NativeToastService);
  private zone          = inject(NgZone);
  public  themeService  = inject(ThemeService);

  colaAlert           = this.invService.alertaCritico;
  diasUso             = this.invService.diasDecorridos;
  agendamentos        = this.agendaService.agendas;
  umidadeAtual        = this.weatherService.umidade;
  statusClimaticoCola = this.weatherService.statusCola;

  constructor() {
    addIcons({ add, checkmarkCircle, alertCircle, trash, moon, sunny });
  }

  async abrirNovoAgendamento() {
    (document.activeElement as HTMLElement)?.blur(); // <-- LIMPA O FOCO AQUI
    
    const { AgendamentoModalComponent } = await import('./agendamento-modal.component');
    const modal = await this.modalCtrl.create({
      component: AgendamentoModalComponent
    });
    return await modal.present();
  }

  async remover(id: string) {
    try {
      await this.agendaService.deletar(id);
      this.zone.run(() => this.toast.disparar('Agendamento removido.'));
    } catch {
      this.zone.run(() => this.toast.disparar('Erro ao remover agendamento.'));
    }
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }
}
