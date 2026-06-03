import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonItem, IonLabel, IonInput, IonTextarea, 
  IonSelect, IonSelectOption, IonButton, 
} from '@ionic/angular/standalone';

// IMPORTAÇÕES DA ARQUITETURA LASHMASTER
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
    IonSelect, IonSelectOption, IonButton, CommonModule, FormsModule
  ]
})
export class ClienteDetalhePage implements OnInit {
  private clientesService = inject(ClientesService);
  private toast = inject(NativeToastService);
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);

  clienteId: string | null = null;
  salvando = false;

  // Estrutura de dados base ligada ao HTML via ngModel
  cliente: Cliente = {
    nome: '',
    telefone: '',
    cep: '',
    endereco: '',
    anamnese: {
      alergias: '',
      formatoOlho: '',
      observacoes: ''
    },
    id: ''
  };

  constructor() {
    addIcons({ saveOutline, trashOutline });
  }

  ngOnInit() {
    // Intercepta a URL para verificar se é Edição ou Criação
    this.clienteId = this.route.snapshot.paramMap.get('id');
    
    if (this.clienteId) {
      // Busca o cliente diretamente do Signal do serviço
      const clienteExistente = this.clientesService.clientes().find(c => c.id === this.clienteId);
      
      if (clienteExistente) {
        // Clona o objeto para não causar mutações acidentais no estado global antes do salvamento
        this.cliente = JSON.parse(JSON.stringify(clienteExistente));
      } else {
        this.toast.disparar('Cliente não encontrada no banco de dados.');
        this.navCtrl.back();
      }
    }
  }

  async salvar() {
    if (!this.cliente.nome.trim()) {
      this.toast.disparar('O nome da cliente é obrigatório!');
      return;
    }

    this.salvando = true;

    try {
      if (this.clienteId) {
        // Dispara a rotina de atualização (UPDATE)
        await this.clientesService.atualizar(this.cliente);
        this.toast.disparar('Ficha da cliente atualizada com sucesso!');
      } else {
        // Extrai o 'id' vazio e envia apenas o resto dos dados para o Firebase
        const { id, ...dadosNovaCliente } = this.cliente;        
        // Dispara a rotina de criação (INSERT)
        await this.clientesService.adicionar(dadosNovaCliente);
        this.toast.disparar('Nova cliente cadastrada com sucesso!');
      }
      this.navCtrl.back(); // Retorna automaticamente para a lista
    } catch (error) {
      this.toast.disparar('Erro ao salvar. Verifique sua conexão.');
    } finally {
      this.salvando = false;
    }
  }

  async remover() {
    if (!this.clienteId) return;

    try {
      // Dispara a rotina de exclusão (DELETE)
      await this.clientesService.remover(this.clienteId);
      this.toast.disparar('Ficha excluída permanentemente.');
      this.navCtrl.back();
    } catch (error) {
      this.toast.disparar('Erro ao tentar remover a cliente.');
    }
  }
}