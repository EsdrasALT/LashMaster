// src/app/services/inventario.ts
import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import {
  Firestore, doc, docData, setDoc, Timestamp
} from '@angular/fire/firestore';
import { afterNextRender } from '@angular/core';
import { Subscription } from 'rxjs';

// Formato interno do Firestore para este documento
interface InventarioDoc {
  dataAberturaCola: Timestamp | null;
  diasValidade: number;
}

@Injectable({ providedIn: 'root' })
export class InventarioService implements OnDestroy {
  private firestore = inject(Firestore);
  private subscription?: Subscription;

  // Caminho fixo: coleção "inventario", documento "config" (documento único)
  private readonly DOC_PATH = 'inventario/config';

  // Estado interno com ISO string — mesma interface que a versão anterior
  private state = signal<{ dataAberturaCola: string | null; diasValidade: number }>({
    dataAberturaCola: null,
    diasValidade: 30,
  });

  // --- Computed públicos: API idêntica à versão anterior ---
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
    this.escutar(); // Chamada direta!
  }

  private escutar() {
    const ref = doc(this.firestore, this.DOC_PATH);
    this.subscription = docData(ref).subscribe({
      next: (dados) => {
        if (!dados) return;  // documento ainda não existe no Firestore — mantém default
        const d = dados as InventarioDoc;
        this.state.set({
          dataAberturaCola: d.dataAberturaCola
            ? d.dataAberturaCola.toDate().toISOString()
            : null,
          diasValidade: d.diasValidade ?? 30,
        });
      },
      error: (err) => console.error('Erro inventário:', err),
    });
  }

  // Grava/atualiza a data de abertura no Firestore
  async resetarCola(): Promise<void> {
    const ref = doc(this.firestore, this.DOC_PATH);
    await setDoc(ref, {
      dataAberturaCola: Timestamp.fromDate(new Date()),
      diasValidade: 30,
    }, { merge: true });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
