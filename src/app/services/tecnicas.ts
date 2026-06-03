import { Injectable, inject, Injector, signal, OnDestroy, NgZone, runInInjectionContext } from '@angular/core';
// Importamos TUDO de um lugar só. Nada de 'firebase/firestore' solto.
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Tecnica } from '../models/types';

@Injectable({ providedIn: 'root' })
export class TecnicasService implements OnDestroy {
  private firestore = inject(Firestore);
  private injector = inject(Injector);
  private zone = inject(NgZone);
  private unsubscribe?: () => void;

  private lista = signal<Tecnica[]>([]);
  tecnicas = this.lista.asReadonly();

  constructor() {
    this.escutar();
  }

  private escutar() {
    const ref = collection(this.firestore, 'tecnicas');
    this.unsubscribe = onSnapshot(ref, (snapshot) => {
      // A ORDEM INVERTIDA AQUI É A CHAVE
      const dados = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Tecnica));
      
      this.zone.run(() => {
        this.lista.set(dados);
      });
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
      const ref = doc(this.firestore, 'tecnicas', id!);
      await updateDoc(ref, dados);
    });
  }

  async deletar(id: string): Promise<void> {
    console.log('[DEBUG 3] SERVICE: Função deletar iniciada. ID recebido:', id);
    
    if (!id) {
      console.error('[DEBUG FATAL] SERVICE: O ID chegou VAZIO. A exclusão foi abortada para não travar o Firebase.');
      return;
    }

    await runInInjectionContext(this.injector, async () => {
      console.log('[DEBUG 4] SERVICE: Executando deleteDoc no Firebase...');
      const ref = doc(this.firestore, 'tecnicas', id);
      await deleteDoc(ref);
    });
  }

  ngOnDestroy() {
    if (this.unsubscribe) this.unsubscribe();
  }
}