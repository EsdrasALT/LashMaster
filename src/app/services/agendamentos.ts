import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { afterNextRender } from '@angular/core';
import { Subscription } from 'rxjs';

export interface Agendamento {
  id?: string;
  clienteNome: string;
  tecnicaNome: string;
  horario: string;
}

@Injectable({ providedIn: 'root' })
export class AgendamentosService implements OnDestroy {
  private firestore = inject(Firestore);
  private subscription?: Subscription;

  agendas = signal<Agendamento[]>([]);

  constructor() {
    // Dispara APÓS o primeiro render — sem delay artificial
    afterNextRender(() => {
      this.escutarAgendamentosDoBanco();
    });
  }

  private escutarAgendamentosDoBanco() {
    const colecaoRef = collection(this.firestore, 'agendamentos');
    this.subscription = collectionData(colecaoRef, { idField: 'id' }).subscribe({
      next: (dados) => this.agendas.set(dados as Agendamento[]),
      error: (erro) => console.error('Erro ao conectar com o Firestore:', erro),
    });
  }

  ngOnDestroy() {
    // Evita memory leak — fecha a conexão quando o service é destruído
    this.subscription?.unsubscribe();
  }
}