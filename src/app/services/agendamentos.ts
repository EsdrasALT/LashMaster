import { Injectable, signal } from '@angular/core';
import { Agendamento } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class AgendamentosService {
  private lista = signal<Agendamento[]>([
    { id: '1', clienteNome: 'Ana Silva', horario: '14:00', tecnicaNome: 'Volume Russo' },
    { id: '2', clienteNome: 'Beatriz Costa', horario: '16:30', tecnicaNome: 'Fio a Fio Clássico' }
  ]);

  agendas = this.lista.asReadonly();

  adicionar(novo: Agendamento) {
    this.lista.update(atual => [...atual, novo]);
  }
}