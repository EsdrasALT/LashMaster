// src/app/services/agendamentos.ts
import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
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
    this.escutarAgendamentosDoBanco(); // Chamada direta!
  }

  private escutarAgendamentosDoBanco() {
    const colecaoRef = collection(this.firestore, 'agendamentos');
    this.subscription = collectionData(colecaoRef, { idField: 'id' }).subscribe({
      next: (dados) => this.agendas.set(dados as Agendamento[]),
      error: (erro) => console.error('Erro ao conectar com o Firestore:', erro),
    });
  }

  // --- NOVO: salva um agendamento no Firestore ---
  async adicionar(agendamento: Omit<Agendamento, 'id'>): Promise<void> {
    const colecaoRef = collection(this.firestore, 'agendamentos');
    await addDoc(colecaoRef, agendamento);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
