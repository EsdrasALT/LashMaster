import { Injectable, inject, Injector, signal, computed, OnDestroy, runInInjectionContext } from '@angular/core';
import { Firestore, doc, setDoc, onSnapshot, Timestamp } from '@angular/fire/firestore';

interface InventarioDoc {
  dataAberturaCola: Timestamp | null;
  diasValidade: number;
}

@Injectable({ providedIn: 'root' })
export class InventarioService implements OnDestroy {
  private firestore = inject(Firestore);
  private injector = inject(Injector); // Fornece o contexto de injeção
  private unsubscribe?: () => void;
  private readonly DOC_PATH = 'inventario/config';

  private state = signal<{ dataAberturaCola: string | null; diasValidade: number }>({
    dataAberturaCola: null,
    diasValidade: 30,
  });

  colaInfo       = computed(() => this.state());
  diasDecorridos = computed(() => {
    const abertura = this.state().dataAberturaCola;
    if (!abertura) return 0;
    const diffMs = Math.abs(new Date().getTime() - new Date(abertura).getTime());
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  });
  alertaCritico  = computed(() => this.diasDecorridos() > 30);
  progressoUso   = computed(() => Math.min(this.diasDecorridos() / 30, 1));

  constructor() {
    this.escutar();
  }

  private escutar() {
    const ref = doc(this.firestore, this.DOC_PATH);
    this.unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      const d = snap.data() as InventarioDoc;
      this.state.set({
        dataAberturaCola: d.dataAberturaCola ? d.dataAberturaCola.toDate().toISOString() : null,
        diasValidade: d.diasValidade ?? 30,
      });
    }, (err) => console.error('Erro inventário:', err));
  }

  async resetarCola(): Promise<void> {
    // Executa a operação dentro do contexto seguro do Angular
    await runInInjectionContext(this.injector, async () => {
      const ref = doc(this.firestore, this.DOC_PATH);
      await setDoc(ref, {
        dataAberturaCola: Timestamp.fromDate(new Date()),
        diasValidade: 30,
      }, { merge: true });
    });
  }

  ngOnDestroy() {
    if (this.unsubscribe) this.unsubscribe();
  }
}