// src/app/pages/agenda/agendamento-modal.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { AgendamentosService } from '../../services/agendamentos';
import { TecnicasService } from '../../services/tecnicas';
import { NativeToastService } from '../../services/native-toast.service';

@Component({
  selector: 'app-agendamento-modal',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
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
        <ion-input
          placeholder="Digite o nome"
          [(ngModel)]="clienteNome">
        </ion-input>
      </ion-item>

      <ion-item class="ion-margin-bottom">
        <ion-label position="stacked">Técnica</ion-label>
        <ion-select placeholder="Selecione" [(ngModel)]="tecnicaSelecionada">
          @for (tecnica of tecnicasService.tecnicas(); track tecnica.id) {
            <ion-select-option [value]="tecnica.nome">
              {{ tecnica.nome }}
            </ion-select-option>
          }
        </ion-select>
      </ion-item>

      <ion-item class="ion-margin-bottom">
        <ion-label position="stacked">Horário</ion-label>
        <ion-input type="time" [(ngModel)]="horario"></ion-input>
      </ion-item>

      <ion-button
        expand="block"
        [disabled]="salvando"
        (click)="agendar()">
        {{ salvando ? 'Agendando...' : 'Agendar Atendimento' }}
      </ion-button>

    </ion-content>
  `
})
export class AgendamentoModalComponent {
  private modalCtrl      = inject(ModalController);
  private agendaService  = inject(AgendamentosService);
  protected tecnicasService = inject(TecnicasService);  // protected: acessível no template
  private toast          = inject(NativeToastService);

  clienteNome        = '';
  tecnicaSelecionada = '';
  horario            = '';
  salvando           = false;

  fechar() {
    this.modalCtrl.dismiss();
  }

  async agendar() {
    if (!this.clienteNome.trim() || !this.tecnicaSelecionada || !this.horario) {
      await this.toast.disparar('Preencha todos os campos antes de agendar.');
      return;
    }

    this.salvando = true;
    try {
      await this.agendaService.adicionar({
        clienteNome:  this.clienteNome.trim(),
        tecnicaNome:  this.tecnicaSelecionada,
        horario:      this.horario,
      });
      await this.toast.disparar('Agendamento salvo com sucesso!');
      this.modalCtrl.dismiss({ salvo: true });
    } catch {
      await this.toast.disparar('Erro ao salvar. Verifique sua conexão.');
    } finally {
      this.salvando = false;
    }
  }
}
