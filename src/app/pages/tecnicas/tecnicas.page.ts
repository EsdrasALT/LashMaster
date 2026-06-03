import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonText,
  IonFab, IonFabButton, ModalController
} from '@ionic/angular/standalone';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { trash, create, timeOutline, cashOutline, add } from 'ionicons/icons';
import { TecnicasService } from '../../services/tecnicas';
import { TecnicaModalComponent } from './tecnica-modal.component';
import { Tecnica } from '../../models/types';

// INJEÇÃO DO TOAST NATIVO
import { NativeToastService } from '../../services/native-toast.service';

@Component({
  selector: 'app-tecnicas',
  templateUrl: './tecnicas.page.html',
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
    IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonText,
    IonFab, IonFabButton
  ],
  providers: [CurrencyPipe]
})
export class TecnicasPage {
  private tecnicasService = inject(TecnicasService);
  private modalCtrl = inject(ModalController);
  private toast = inject(NativeToastService); // Instanciando o Toast
  
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
    
    // TRATAMENTO DE ERROS E SINCRONISMO
    if (data) {
      try {
        if (tecnica) {
          await this.tecnicasService.atualizar(data);
          this.toast.disparar('Técnica atualizada com sucesso!');
        } else {
          await this.tecnicasService.adicionar(data);
          this.toast.disparar('Técnica adicionada com sucesso!');
        }
      } catch (error) {
        this.toast.disparar('Erro ao salvar. Verifique sua conexão.');
      }
    }
  }

  async remover(id: string) {
    try {
      await this.tecnicasService.deletar(id);
      this.toast.disparar('Técnica removida!');
    } catch (error) {
      this.toast.disparar('Erro ao remover técnica.');
    }
  }
}