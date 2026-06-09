import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonProgressBar, IonButton, IonIcon, IonText, IonNote,
  IonModal, IonDatetime, IonDatetimeButton, IonItem, IonLabel // Novos Imports
} from '@ionic/angular/standalone';
import { CommonModule, DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { refreshOutline, alertCircleOutline, checkmarkCircleOutline, calendarOutline } from 'ionicons/icons';
import { InventarioService } from '../../services/inventario';
import { NativeToastService } from 'src/app/services/native-toast.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
    IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar, IonButton, 
    IonIcon, IonText, IonNote, IonModal, IonDatetime, IonDatetimeButton
  ],
  providers: [DatePipe]
})
export class InventarioPage {
  private invService = inject(InventarioService);
  private toastNativo = inject(NativeToastService);

  // Vinculando os Signals do Service para a UI
  colaInfo = this.invService.colaInfo;
  diasUso = this.invService.diasDecorridos;
  alertaCritico = this.invService.alertaCritico;
  progresso = this.invService.progressoUso;

  constructor() {
    addIcons({ refreshOutline, alertCircleOutline, checkmarkCircleOutline, calendarOutline });
  }

  abrirNovaCola() {
    this.invService.resetarCola();
  }

  // Pega a data atual do banco para o calendário abrir no dia certo
  getDataAtualFormatada() {
    const data = this.colaInfo().dataAberturaCola;
    if (!data) return new Date().toISOString();
    return new Date(data).toISOString();
  }

  // Disparado quando a usuária clica em "Confirmar" no calendário
  async alterarData(event: any) {
    const novaData = event.detail.value;
    if (novaData) {
      try {
        await this.invService.alterarDataAbertura(novaData);
        this.toastNativo.disparar('Data de abertura ajustada com sucesso!');
      } catch(e) {
        this.toastNativo.disparar('Erro ao atualizar a data.');
      }
    }
  }

  verificarValidade() {
    if (this.diasUso() > 30) {
      this.toastNativo.disparar('❌ Urgente: A cola atingiu 30 dias de uso. Troque-a agora!');
    }
  }
}