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
  
  listaTecnicas = this.tecnicasService.tecnicas;

  constructor() {
    addIcons({ trash, create, timeOutline, cashOutline, add });
  }

  async abrirModal(tecnica?: Tecnica) {
    (document.activeElement as HTMLElement)?.blur(); // Remove o conflito de foco visual (aria-hidden)

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
          this.toast.disparar('Técnica atualizada com sucesso!');
        } else {
          await this.tecnicasService.adicionar(data);
          this.toast.disparar('Técnica adicionada com sucesso!');
        }
      } catch (error) {
        this.toast.disparar('Erro ao salvar técnica.');
      }
    }
  }

  async remover(id: string) {
    console.log('[DEBUG 1] PAGE: Botão excluir clicado. ID recebido do HTML:', id);
    try {
      console.log('[DEBUG 2] PAGE: Chamando tecnicasService.deletar()...');
      await this.tecnicasService.deletar(id);
      console.log('[DEBUG 5] PAGE: Firebase concluiu a exclusão com sucesso!');
      this.toast.disparar('Técnica removida com sucesso!');
    } catch (error) {
      console.error('[DEBUG ERRO] PAGE: Falha na exclusão:', error);
      this.toast.disparar('Erro ao tentar remover.');
    }
  }
}