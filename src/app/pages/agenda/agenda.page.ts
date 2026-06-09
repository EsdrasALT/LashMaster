import { Component, inject, NgZone, computed } from '@angular/core';
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
    IonItemSliding, IonItemOptions, IonItemOption
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
  umidadeAtual        = this.weatherService.umidade;
  statusClimaticoCola = this.weatherService.statusCola;

  constructor() {
    addIcons({ add, checkmarkCircle, alertCircle, trash, moon, sunny });
  }

  // Helper para pegar a data de hoje no mesmo formato do Input (YYYY-MM-DD)
  private getHojeString(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  // LISTA 1: Apenas os agendamentos com a data de Hoje (Ordenados por horário)
  agendamentosHoje = computed(() => {
    const hoje = this.getHojeString();
    return this.agendaService.agendas()
      .filter(a => a.data === hoje)
      .sort((a, b) => {
        // Fallback de segurança para dados antigos
        const horarioA = a.horario || '';
        const horarioB = b.horario || '';
        return horarioA.localeCompare(horarioB);
      });
  });

  // LISTA 2: Agendamentos de outras datas ou sem data (Ordenados por data e depois horário)
  agendamentosFuturos = computed(() => {
    const hoje = this.getHojeString();
    return this.agendaService.agendas()
      .filter(a => a.data !== hoje)
      .sort((a, b) => {
        // Fallback de segurança para dados antigos (Legacy Data)
        const dataA = a.data || '';
        const dataB = b.data || '';
        const horarioA = a.horario || '';
        const horarioB = b.horario || '';

        if (dataA === dataB) {
          return horarioA.localeCompare(horarioB);
        }
        return dataA.localeCompare(dataB);
      });
  });

// Substitua a função abrirNovoAgendamento por esta:
  async abrirModalAgendamento(agendamento?: any) {
    (document.activeElement as HTMLElement)?.blur();
    
    const { AgendamentoModalComponent } = await import('./agendamento-modal.component');
    const modal = await this.modalCtrl.create({
      component: AgendamentoModalComponent,
      componentProps: { agendamentoEdit: agendamento } // Passa os dados se for edição
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