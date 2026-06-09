import { Component, inject, NgZone, signal, computed, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonItem, IonLabel, IonInput, IonList, IonIcon
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { AgendamentosService } from '../../services/agendamentos';
import { TecnicasService } from '../../services/tecnicas';
import { ClientesService } from '../../services/clientes';
import { NativeToastService } from '../../services/native-toast.service';

@Component({
  selector: 'app-agendamento-modal',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonItem, IonLabel, IonInput, IonList, IonIcon
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ agendamentoEdit ? 'Editar Agendamento' : 'Novo Agendamento' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="fechar()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div class="ion-margin-bottom">
        <ion-item fill="outline" mode="md">
          <ion-label position="floating">Buscar Cliente</ion-label>
          <ion-input type="text" placeholder="Digite o nome..." [value]="termoBusca()" (ionInput)="buscarCliente($event)" clearInput="true"></ion-input>
        </ion-item>
        @if (mostrarLista()) {
          <ion-list class="ion-no-margin" style="max-height: 160px; overflow-y: auto; border: 1px solid var(--ion-color-step-150); border-radius: 8px; margin-top: 4px;">
            @for (cliente of clientesFiltrados(); track cliente.id) {
              <ion-item button (click)="selecionarCliente(cliente.nome)">
                <ion-label>{{ cliente.nome }}</ion-label>
              </ion-item>
            } @empty {
              <ion-item><ion-label color="medium">Nenhuma cliente encontrada</ion-label></ion-item>
            }
          </ion-list>
        }
      </div>

      <div class="ion-margin-bottom">
        <ion-item fill="outline" mode="md">
          <ion-label position="floating">Buscar Técnica</ion-label>
          <ion-input type="text" placeholder="Digite a técnica..." [value]="termoBuscaTecnica()" (ionInput)="buscarTecnica($event)" clearInput="true"></ion-input>
        </ion-item>
        @if (mostrarListaTecnicas()) {
          <ion-list class="ion-no-margin" style="max-height: 160px; overflow-y: auto; border: 1px solid var(--ion-color-step-150); border-radius: 8px; margin-top: 4px;">
            @for (tecnica of tecnicasFiltradas(); track tecnica.id) {
              <ion-item button (click)="selecionarTecnica(tecnica.nome)">
                <ion-label>{{ tecnica.nome }}</ion-label>
              </ion-item>
            } @empty {
              <ion-item><ion-label color="medium">Nenhuma técnica encontrada</ion-label></ion-item>
            }
          </ion-list>
        }
      </div>

      <ion-item fill="outline" mode="md" class="ion-margin-bottom">
        <ion-label position="floating">Data</ion-label>
        <ion-input type="date" [(ngModel)]="data"></ion-input>
      </ion-item>

      <ion-item fill="outline" mode="md" class="ion-margin-bottom">
        <ion-label position="floating">Horário</ion-label>
        <ion-input type="time" [(ngModel)]="horario"></ion-input>
      </ion-item>

      <ion-button expand="block" [disabled]="salvando" (click)="agendar()" class="ion-margin-top">
        {{ salvando ? 'Processando...' : (agendamentoEdit ? 'Atualizar Atendimento' : 'Agendar Atendimento') }}
      </ion-button>

      @if (agendamentoEdit) {
        <ion-button expand="block" color="danger" fill="clear" class="ion-margin-top" (click)="excluir()" [disabled]="salvando">
          <ion-icon name="trash" slot="start"></ion-icon>
          Excluir Agendamento
        </ion-button>
      }

    </ion-content>
  `
})
export class AgendamentoModalComponent implements OnInit {
  @Input() agendamentoEdit?: any; // Recebe o dado se for clicado na lista

  private modalCtrl       = inject(ModalController);
  private agendaService   = inject(AgendamentosService);
  protected tecnicasService = inject(TecnicasService);
  protected clientesService = inject(ClientesService);
  private toast           = inject(NativeToastService);
  private zone            = inject(NgZone);

  termoBusca = signal('');
  clienteNome = '';

  termoBuscaTecnica = signal('');
  tecnicaSelecionada = '';
  
  data = new Date().toISOString().split('T')[0]; 
  horario  = '';
  salvando = false;

  // POPULA OS DADOS SE FOR EDIÇÃO
  ngOnInit() {
    if (this.agendamentoEdit) {
      this.clienteNome = this.agendamentoEdit.clienteNome;
      this.termoBusca.set(this.agendamentoEdit.clienteNome);
      
      this.tecnicaSelecionada = this.agendamentoEdit.tecnicaNome;
      this.termoBuscaTecnica.set(this.agendamentoEdit.tecnicaNome);
      
      this.data = this.agendamentoEdit.data;
      this.horario = this.agendamentoEdit.horario;
    }
  }

  // --- Filtros (Mantidos iguais) ---
  clientesFiltrados = computed(() => {
    const termo = this.termoBusca().toLowerCase();
    return this.clientesService.clientes().filter(c => c.nome.toLowerCase().includes(termo));
  });

  mostrarLista = computed(() => {
    const termo = this.termoBusca().trim();
    return termo.length > 0 && termo !== this.clienteNome;
  });

  buscarCliente(event: any) {
    this.termoBusca.set(event.detail.value || '');
    this.clienteNome = ''; 
  }

  selecionarCliente(nome: string) {
    this.clienteNome = nome; 
    this.termoBusca.set(nome); 
  }

  tecnicasFiltradas = computed(() => {
    const termo = this.termoBuscaTecnica().toLowerCase();
    return this.tecnicasService.tecnicas().filter(t => t.nome.toLowerCase().includes(termo));
  });

  mostrarListaTecnicas = computed(() => {
    const termo = this.termoBuscaTecnica().trim();
    return termo.length > 0 && termo !== this.tecnicaSelecionada;
  });

  buscarTecnica(event: any) {
    this.termoBuscaTecnica.set(event.detail.value || '');
    this.tecnicaSelecionada = ''; 
  }

  selecionarTecnica(nome: string) {
    this.tecnicaSelecionada = nome; 
    this.termoBuscaTecnica.set(nome); 
  }

  fechar() {
    this.modalCtrl.dismiss();
  }

  async agendar() {
    if (!this.clienteNome || !this.tecnicaSelecionada || !this.data || !this.horario) {
      await this.toast.disparar('Preencha todos os campos.');
      return;
    }

    this.salvando = true;
    try {
      if (this.agendamentoEdit) {
        // MODO ATUALIZAÇÃO
        await this.agendaService.atualizar({
          id: this.agendamentoEdit.id,
          clienteNome: this.clienteNome,
          tecnicaNome: this.tecnicaSelecionada,
          data: this.data,       
          horario: this.horario,
        });
        this.zone.run(() => {
          this.toast.disparar('Agendamento atualizado com sucesso!');
          this.modalCtrl.dismiss({ salvo: true });
        });
      } else {
        // MODO CRIAÇÃO
        await this.agendaService.adicionar({
          clienteNome: this.clienteNome,
          tecnicaNome: this.tecnicaSelecionada,
          data: this.data,       
          horario: this.horario,
        });
        this.zone.run(() => {
          this.toast.disparar('Agendamento criado com sucesso!');
          this.modalCtrl.dismiss({ salvo: true });
        });
      }
    } catch {
      this.zone.run(() => this.toast.disparar('Erro ao salvar comunicação.'));
    } finally {
      this.zone.run(() => this.salvando = false);
    }
  }

  async excluir() {
    if (!this.agendamentoEdit?.id) return;
    
    this.salvando = true;
    try {
      await this.agendaService.deletar(this.agendamentoEdit.id);
      this.zone.run(() => {
        this.toast.disparar('Agendamento cancelado.');
        this.modalCtrl.dismiss({ excluido: true });
      });
    } catch {
      this.zone.run(() => this.toast.disparar('Erro ao tentar excluir.'));
    } finally {
      this.zone.run(() => this.salvando = false);
    }
  }
}