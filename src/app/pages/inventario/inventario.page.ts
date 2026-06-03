import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonProgressBar, IonButton, IonIcon, IonText, IonNote 
} from '@ionic/angular/standalone';
import { CommonModule, DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { refreshOutline, alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { InventarioService } from '../../services/inventario';
import { NativeToastService } from 'src/app/services/native-toast.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
    IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar, IonButton, 
    IonIcon, IonText, IonNote
  ],
  providers: [DatePipe]
})
export class InventarioPage {
  private invService = inject(InventarioService);
  private toastNativo = inject(NativeToastService); // 1. Injeta o serviço

  // Vinculando os Signals do Service para a UI
  colaInfo = this.invService.colaInfo;
  diasUso = this.invService.diasDecorridos;
  alertaCritico = this.invService.alertaCritico;
  progresso = this.invService.progressoUso;

  constructor() {
    addIcons({ refreshOutline, alertCircleOutline, checkmarkCircleOutline });
  }

  abrirNovaCola() {
    this.invService.resetarCola();
  }

  verificarValidade() {
    if (this.diasUso() > 30) {
      this.toastNativo.disparar('❌ Urgente: A cola atingiu 30 dias de uso. Troque-a agora!');
    }
  }
}