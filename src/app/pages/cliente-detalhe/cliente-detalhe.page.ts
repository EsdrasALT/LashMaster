import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonItem, IonLabel, IonInput, IonTextarea, 
  IonSelect, IonSelectOption, IonButton, IonIcon
} from '@ionic/angular/standalone';

import { ClientesService } from '../../services/clientes';
import { NativeToastService } from '../../services/native-toast.service';
import { Cliente } from '../../models/types';
import { addIcons } from 'ionicons';
import { saveOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-cliente-detalhe',
  templateUrl: './cliente-detalhe.page.html',
  styleUrls: ['./cliente-detalhe.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonItem, IonLabel, IonInput, IonTextarea, 
    IonSelect, IonSelectOption, IonButton, IonIcon, CommonModule, FormsModule
  ]
})
export class ClienteDetalhePage implements OnInit {
  private clientesService = inject(ClientesService);
  private toast = inject(NativeToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private zone = inject(NgZone); // <-- O SALVADOR DA THREAD

  clienteId: string | null = null;
  salvando = false;

  cliente: Cliente = {
    nome: '', telefone: '', cep: '', endereco: '',
    anamnese: { alergias: '', formatoOlho: '', observacoes: '' },
    id: ''
  };

  constructor() {
    addIcons({ saveOutline, trashOutline });
  }

  ngOnInit() {
    this.clienteId = this.route.snapshot.paramMap.get('id');
    if (this.clienteId) {
      const clienteExistente = this.clientesService.clientes().find(c => c.id === this.clienteId);
      if (clienteExistente) {
        this.cliente = JSON.parse(JSON.stringify(clienteExistente));
      } else {
        this.toast.disparar('Cliente não encontrada.');
        this.router.navigate(['/tabs/clientes']);
      }
    }
  }

  async salvar() {
    console.log('[DEBUG 1] PAGE: Botão salvar clicado. Dados recebidos do HTML:', JSON.stringify(this.cliente));

    if (!this.cliente.nome.trim()) {
      console.warn('[DEBUG 2] PAGE: Salvamento bloqueado. O campo Nome estava vazio.');
      this.toast.disparar('O nome da cliente é obrigatório!');
      return;
    }
    
    this.salvando = true;

    try {
      if (this.clienteId) {
        console.log('[DEBUG 3] PAGE: Iniciando UPDATE do cliente existente ID:', this.clienteId);
        await this.clientesService.atualizar(this.cliente);
      } else {
        console.log('[DEBUG 3] PAGE: Iniciando INSERT de nova cliente...');
        const { id, ...dadosNovaCliente } = this.cliente;
        await this.clientesService.adicionar(dadosNovaCliente);
      }
      
      console.log('[DEBUG 4] PAGE: Firebase retornou sucesso! Fechando a tela...');
      this.zone.run(() => {
        this.toast.disparar(this.clienteId ? 'Ficha atualizada!' : 'Cliente cadastrada!');
        this.router.navigate(['/tabs/clientes']);
      });

    } catch (error) {
      console.error('[DEBUG ERRO] PAGE: Ocorreu uma falha na comunicação com o banco:', error);
      this.zone.run(() => this.toast.disparar('Erro ao salvar. Verifique sua conexão.'));
    } finally {
      this.zone.run(() => this.salvando = false);
    }
  }

  async remover() {
    if (!this.clienteId) return;
    try {
      await this.clientesService.remover(this.clienteId);
      this.zone.run(() => {
        this.toast.disparar('Ficha excluída permanentemente.');
        this.router.navigate(['/tabs/clientes']);
      });
    } catch (error) {
      this.zone.run(() => this.toast.disparar('Erro ao tentar remover a cliente.'));
    }
  }
}