import { Injectable, inject, Injector, signal, OnDestroy, runInInjectionContext } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Tecnica } from '../models/types';

@Injectable({ providedIn: 'root' })
export class TecnicasService implements OnDestroy {
  private firestore = inject(Firestore);
  private injector = inject(Injector);
  private unsubscribe?: () => void;

  private lista = signal<Tecnica[]>([]);
  tecnicas = this.lista.asReadonly();

  constructor() {
    this.escutar();
  }

  private escutar() {
    const ref = collection(this.firestore, 'tecnicas');
    this.unsubscribe = onSnapshot(ref, (snapshot) => {
      const dados = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Tecnica));
      this.lista.set(dados);
    }, (err) => console.error('Erro técnicas:', err));
  }

  async adicionar(nova: Omit<Tecnica, 'id'>): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const ref = collection(this.firestore, 'tecnicas');
      await addDoc(ref, nova);
    });
  }

  async atualizar(editada: Tecnica): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const { id, ...dados } = editada;
      const ref = doc(this.firestore, 'tecnicas', id);
      await updateDoc(ref, dados as Record<string, any>);
    });
  }

  async deletar(id: string): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const ref = doc(this.firestore, 'tecnicas', id);
      await deleteDoc(ref);
    });
  }

  ngOnDestroy() {
    if (this.unsubscribe) this.unsubscribe();
  }
}