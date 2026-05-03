import { Injectable, signal } from '@angular/core';
import { Tecnica } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class TecnicasService {
  // Lista inicial de exemplo
  private lista = signal<Tecnica[]>([
    { id: '1', nome: 'Volume Russo', preco: 150.00, tempoEstimado: '2h 00m' },
    { id: '2', nome: 'Fio a Fio', preco: 120.00, tempoEstimado: '1h 30m' },
  ]);

  // Signal público para leitura
  tecnicas = this.lista.asReadonly();

  // Método para deletar
  deletar(id: string) {
    this.lista.update(atual => atual.filter(t => t.id !== id));
  }

  // Método para adicionar (usaremos na próxima sub-tarefa)
  adicionar(nova: Tecnica) {
    this.lista.update(atual => [...atual, nova]);
  }

    // Adicione este método dentro da classe TecnicasService no seu arquivo tecnicas.ts
  atualizar(editada: Tecnica) {
    this.lista.update(atual => 
      atual.map(t => t.id === editada.id ? editada : t)
    );
  }
}

