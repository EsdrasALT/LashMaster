import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, 
  IonIcon, IonText, IonList, IonItem, IonLabel, IonFab, IonFabButton, ModalController 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { add, checkmarkCircle, alertCircle } from 'ionicons/icons';
import { InventarioService } from '../../services/inventario';
import { AgendamentoModalComponent } from './agendamento-modal.component';
import { AgendamentosService } from '../../services/agendamentos';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
    IonCardContent, IonIcon, IonText, IonList, IonItem, IonLabel, IonFab, IonFabButton
    // REMOVA AgendamentoModalComponent DAQUI[cite: 3]
  ]
})
export class AgendaPage {
  private invService = inject(InventarioService);
  private modalCtrl = inject(ModalController);
  private agendaService = inject(AgendamentosService);
  themeService = inject(ThemeService);

  // Signals para o Banner
  colaAlert = this.invService.alertaCritico;
  diasUso = this.invService.diasDecorridos;

  // Signal da Lista (Vindo do Service)
  agendamentos = this.agendaService.agendas;

  constructor() {
    addIcons({ add, checkmarkCircle, alertCircle });
  }

  async abrirNovoAgendamento() {
    const modal = await this.modalCtrl.create({
      component: AgendamentoModalComponent
    });
    return await modal.present();
  }

  
}