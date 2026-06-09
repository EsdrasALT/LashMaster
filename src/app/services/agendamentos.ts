import { Injectable, inject, Injector, signal, OnDestroy, runInInjectionContext } from '@angular/core';
// Adicionado o updateDoc na importação abaixo:
import { Firestore, collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from '@angular/fire/firestore';

export interface Agendamento {
  id?: string;
  clienteNome: string;
  tecnicaNome: string;
  data: string;
  horario: string;
}

@Injectable({ providedIn: 'root' })
export class AgendamentosService implements OnDestroy {
  private firestore = inject(Firestore);
  private injector = inject(Injector);
  private unsubscribe?: () => void;

  agendas = signal<Agendamento[]>([]);

  constructor() {
    this.escutarAgendamentosDoBanco();
  }

  private escutarAgendamentosDoBanco() {
    const ref = collection(this.firestore, 'agendamentos');
    this.unsubscribe = onSnapshot(ref, (snapshot) => {
      const dados = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Agendamento));
      this.agendas.set(dados);
    }, (erro) => console.error('Erro agendamentos:', erro));
  }

  async adicionar(agendamento: Omit<Agendamento, 'id'>): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const ref = collection(this.firestore, 'agendamentos');
      await addDoc(ref, agendamento);
    });
  }

  // NOVA FUNÇÃO DE ATUALIZAÇÃO
  async atualizar(editado: Agendamento): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const { id, ...dados } = editado;
      const ref = doc(this.firestore, 'agendamentos', id!);
      await updateDoc(ref, dados as Record<string, any>);
    });
  }
  
  async deletar(id: string): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const ref = doc(this.firestore, 'agendamentos', id);
      await deleteDoc(ref);
    });
  }

  ngOnDestroy() {
    if (this.unsubscribe) this.unsubscribe();
  }
}