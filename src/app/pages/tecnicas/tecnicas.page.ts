import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonText,
  IonFab, IonFabButton, ModalController // Adicionei IonFab e IonFabButton aqui
} from '@ionic/angular/standalone';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { trash, create, timeOutline, cashOutline, add } from 'ionicons/icons';
import { TecnicasService } from '../../services/tecnicas';
import { TecnicaModalComponent } from './tecnica-modal.component';
import { Tecnica } from '../../models/types';

@Component({
  selector: 'app-tecnicas',
  templateUrl: './tecnicas.page.html',
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
    IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonText,
    IonFab, IonFabButton // E adicionei eles aqui também na lista de imports do componente
  ],
  providers: [CurrencyPipe]
})
export class TecnicasPage {
  private tecnicasService = inject(TecnicasService);
  private modalCtrl = inject(ModalController);
  
  listaTecnicas = this.tecnicasService.tecnicas;

  constructor() {
    addIcons({ trash, create, timeOutline, cashOutline, add });
  }

  async abrirModal(tecnica?: Tecnica) {
    const modal = await this.modalCtrl.create({
      component: TecnicaModalComponent,
      componentProps: { tecnica }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      if (tecnica) {
        this.tecnicasService.atualizar(data);
      } else {
        this.tecnicasService.adicionar(data);
      }
    }
  }

  remover(id: string) {
    this.tecnicasService.deletar(id);
  }
}