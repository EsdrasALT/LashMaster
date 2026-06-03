import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class NativeToastService {
  private toastController = inject(ToastController);

  async disparar(mensagem: string, posicao: 'top' | 'middle' | 'bottom' = 'top') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000, // 3 segundos na tela
      position: posicao,
      color: 'dark',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}