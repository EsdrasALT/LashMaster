// import { Component, Input, OnInit, inject } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { 
//   IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
//   IonContent, IonItem, IonInput, IonLabel 
// } from '@ionic/angular/standalone';
// import { ModalController } from '@ionic/angular/standalone';
// import { Tecnica } from '../../models/types';

// @Component({
//   selector: 'app-tecnica-modal',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, 
//     IonButtons, IonButton, IonContent, IonItem, IonInput, IonLabel
//   ],
//   template: `
//     <ion-header>
//       <ion-toolbar>
//         <ion-title>{{ tecnica ? 'Editar' : 'Nova' }} Técnica</ion-title>
//         <ion-buttons slot="end">
//           <ion-button (click)="cancelar()">Cancelar</ion-button>
//         </ion-buttons>
//       </ion-toolbar>
//     </ion-header>

//     <ion-content class="ion-padding">
//       <form [formGroup]="form" (ngSubmit)="salvar()">
//         <ion-item>
//           <ion-label position="stacked">Nome da Técnica</ion-label>
//           <ion-input formControlName="nome" placeholder="Ex: Volume Russo"></ion-input>
//         </ion-item>

//         <ion-item>
//           <ion-label position="stacked">Preço (R$)</ion-label>
//           <ion-input type="number" formControlName="preco" placeholder="0.00"></ion-input>
//         </ion-item>

//         <ion-item>
//           <ion-label position="stacked">Tempo Estimado</ion-label>
//           <ion-input formControlName="tempoEstimado" placeholder="Ex: 2h 15m"></ion-input>
//         </ion-item>

//         <ion-button expand="block" type="submit" [disabled]="form.invalid" class="ion-margin-top">
//           Salvar Técnica
//         </ion-button>
//       </form>
//     </ion-content>
//   `
// })
// export class TecnicaModalComponent implements OnInit {
//   @Input() tecnica?: Tecnica; // Recebe dados para edição
  
//   private fb = inject(FormBuilder);
//   private modalCtrl = inject(ModalController);
  
//   form!: FormGroup;

//   ngOnInit() {
//     this.form = this.fb.group({
//       nome: [this.tecnica?.nome || '', [Validators.required]],
//       preco: [this.tecnica?.preco || '', [Validators.required, Validators.min(0)]],
//       tempoEstimado: [this.tecnica?.tempoEstimado || '', [Validators.required]]
//     });
//   }

//   cancelar() {
//     this.modalCtrl.dismiss();
//   }

//   salvar() {
//     if (this.form.valid) {
//       const dados = {
//         ...this.form.value,
//         id: this.tecnica?.id || Date.now().toString() // Gera ID se for novo
//       };
//       this.modalCtrl.dismiss(dados);
//     }
//   }
// }

import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ModalController, IonHeader, IonToolbar, IonTitle, IonButtons, 
  IonButton, IonContent, IonItem, IonLabel, IonInput, IonIcon 
} from '@ionic/angular/standalone';
import { Tecnica } from '../../models/types';
import { NativeToastService } from '../../services/native-toast.service';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';

@Component({
  selector: 'app-tecnica-modal',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonButton, IonContent, IonItem, IonLabel, IonInput, IonIcon
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ tecnica ? 'Editar Técnica' : 'Nova Técnica' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="fechar()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item fill="outline" mode="md" class="ion-margin-bottom">
        <ion-label position="floating">Nome da Técnica</ion-label>
        <ion-input type="text" [(ngModel)]="nome"></ion-input>
      </ion-item>

      <ion-item fill="outline" mode="md" class="ion-margin-bottom">
        <ion-label position="floating">Valor (R$)</ion-label>
        <ion-input type="number" [(ngModel)]="valor"></ion-input>
      </ion-item>

      <ion-item fill="outline" mode="md" class="ion-margin-bottom">
        <ion-label position="floating">Duração (Ex: 2h, 90min)</ion-label>
        <ion-input type="text" [(ngModel)]="duracao"></ion-input>
      </ion-item>

      <ion-button expand="block" (click)="salvar()" class="ion-margin-top">
        {{ tecnica ? 'Atualizar Técnica' : 'Salvar Técnica' }}
      </ion-button>

      @if (tecnica) {
        <ion-button expand="block" color="danger" fill="clear" class="ion-margin-top" (click)="excluir()">
          <ion-icon name="trash" slot="start"></ion-icon>
          Excluir Técnica
        </ion-button>
      }
    </ion-content>
  `
})
export class TecnicaModalComponent implements OnInit {
  @Input() tecnica?: Tecnica;

  private modalCtrl = inject(ModalController);
  private toast = inject(NativeToastService);

  nome = '';
  valor: number | null = null;
  duracao = '';

  constructor() {
    addIcons({ trash });
  }

  ngOnInit() {
    if (this.tecnica) {
      this.nome = this.tecnica.nome;
      this.valor = this.tecnica.valor;
      this.duracao = this.tecnica.duracao;
    }
  }

  fechar() {
    this.modalCtrl.dismiss();
  }

  async salvar() {
    if (!this.nome || this.valor === null || !this.duracao) {
      this.toast.disparar('Preencha todos os campos!');
      return;
    }

    this.modalCtrl.dismiss({
      id: this.tecnica?.id,
      nome: this.nome,
      valor: this.valor,
      duracao: this.duracao
    });
  }

  excluir() {
    // Ao invés de deletar aqui, enviamos uma flag avisando a página principal
    this.modalCtrl.dismiss({ action: 'delete', id: this.tecnica?.id });
  }
}