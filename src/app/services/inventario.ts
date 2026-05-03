import { Injectable, signal, computed } from '@angular/core';
import { Inventario } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  // Estado inicial: data de hoje e validade de 30 dias
  private state = signal<Inventario>({
    dataAberturaCola: new Date().toISOString(),
    /*dataAberturaCola: '2026-03-01T10:00:00.000Z',*/
    diasValidade: 30
  });

  colaInfo = computed(() => this.state());

  diasDecorridos = computed(() => {
    const abertura = this.state().dataAberturaCola;
    if (!abertura) return 0;
    
    const dataInicio = new Date(abertura);
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - dataInicio.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });

  alertaCritico = computed(() => this.diasDecorridos() > 30);

  resetarCola() {
    this.state.set({
      ...this.state(),
      dataAberturaCola: new Date().toISOString()
    });
  }

  // Calcula o progresso de 0 a 1 (onde 1 é 30 dias ou mais)
  progressoUso = computed(() => {
    const dias = this.diasDecorridos();
    const percentual = dias / 30;
    return percentual > 1 ? 1 : percentual;
  });

}