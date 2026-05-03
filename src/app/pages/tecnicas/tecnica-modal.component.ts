import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
  IonContent, IonItem, IonInput, IonLabel 
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { Tecnica } from '../../models/types';

@Component({
  selector: 'app-tecnica-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonButton, IonContent, IonItem, IonInput, IonLabel
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ tecnica ? 'Editar' : 'Nova' }} Técnica</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cancelar()">Cancelar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="salvar()">
        <ion-item>
          <ion-label position="stacked">Nome da Técnica</ion-label>
          <ion-input formControlName="nome" placeholder="Ex: Volume Russo"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Preço (R$)</ion-label>
          <ion-input type="number" formControlName="preco" placeholder="0.00"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Tempo Estimado</ion-label>
          <ion-input formControlName="tempoEstimado" placeholder="Ex: 2h 15m"></ion-input>
        </ion-item>

        <ion-button expand="block" type="submit" [disabled]="form.invalid" class="ion-margin-top">
          Salvar Técnica
        </ion-button>
      </form>
    </ion-content>
  `
})
export class TecnicaModalComponent implements OnInit {
  @Input() tecnica?: Tecnica; // Recebe dados para edição
  
  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  
  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      nome: [this.tecnica?.nome || '', [Validators.required]],
      preco: [this.tecnica?.preco || '', [Validators.required, Validators.min(0)]],
      tempoEstimado: [this.tecnica?.tempoEstimado || '', [Validators.required]]
    });
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }

  salvar() {
    if (this.form.valid) {
      const dados = {
        ...this.form.value,
        id: this.tecnica?.id || Date.now().toString() // Gera ID se for novo
      };
      this.modalCtrl.dismiss(dados);
    }
  }
}