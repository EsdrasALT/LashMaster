import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
  IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption 
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-agendamento-modal',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
    IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Novo Agendamento</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="fechar()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item class="ion-margin-bottom">
        <ion-label position="stacked">Nome da Cliente</ion-label>
        <ion-input placeholder="Digite o nome"></ion-input>
      </ion-item>
      <ion-item class="ion-margin-bottom">
        <ion-label position="stacked">Técnica</ion-label>
        <ion-select placeholder="Selecione">
          <ion-select-option value="vol">Volume Russo</ion-select-option>
          <ion-select-option value="fio">Fio a Fio</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item class="ion-margin-bottom">
        <ion-label position="stacked">Horário</ion-label>
        <ion-input type="time"></ion-input>
      </ion-item>
      <ion-button expand="block" (click)="fechar()">Agendar Atendimento</ion-button>
    </ion-content>
  `
})
export class AgendamentoModalComponent {
  private modalCtrl = inject(ModalController);
  fechar() { this.modalCtrl.dismiss(); }
}