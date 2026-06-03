import { Component, inject, NgZone } from '@angular/core';
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
  private toast = inject(NativeToastService);
  private zone = inject(NgZone); // <-- AQUI
  
  listaTecnicas = this.tecnicasService.tecnicas;

  constructor() {
    addIcons({ trash, create, timeOutline, cashOutline, add });
  }

  async abrirModal(tecnica?: Tecnica) {
    (document.activeElement as HTMLElement)?.blur(); // <-- LIMPA O FOCO AQUI
    
    const modal = await this.modalCtrl.create({
      component: TecnicaModalComponent,
      componentProps: { tecnica }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      try {
        if (tecnica) {
          await this.tecnicasService.atualizar(data);
        } else {
          await this.tecnicasService.adicionar(data);
        }
        this.zone.run(() => this.toast.disparar('Técnica salva com sucesso!'));
      } catch (error) {
        this.zone.run(() => this.toast.disparar('Erro ao salvar técnica.'));
      }
    }
  }

  async remover(id: string) {
    try {
      await this.tecnicasService.deletar(id);
      // Força o Angular a fechar o item e dar o toast
      this.zone.run(() => this.toast.disparar('Técnica removida!'));
    } catch (error) {
      this.zone.run(() => this.toast.disparar('Erro ao remover técnica.'));
    }
  }
}