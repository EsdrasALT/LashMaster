import { Injectable, inject, Injector, signal, OnDestroy, runInInjectionContext } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Cliente } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ClientesService implements OnDestroy {
  private firestore = inject(Firestore);
  private injector = inject(Injector);
  private unsubscribe?: () => void;

  private lista = signal<Cliente[]>([]);
  clientes = this.lista.asReadonly();

  constructor() {
    this.escutar();
  }

  private escutar() {
    const ref = collection(this.firestore, 'clientes');
    this.unsubscribe = onSnapshot(ref, (snapshot) => {
      const dados = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Cliente));
      this.lista.set(dados);
    }, (error) => console.error('Erro clientes:', error));
  }

  async adicionar(novo: Omit<Cliente, 'id'>): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const ref = collection(this.firestore, 'clientes');
      await addDoc(ref, novo);
    });
  }

  async atualizar(editado: Cliente): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const { id, ...dados } = editado;
      const ref = doc(this.firestore, 'clientes', id);
      await updateDoc(ref, dados as Record<string, any>);
    });
  }

  async remover(id: string): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const ref = doc(this.firestore, 'clientes', id);
      await deleteDoc(ref);
    });
  }

  ngOnDestroy() {
    if (this.unsubscribe) this.unsubscribe();
  }
}