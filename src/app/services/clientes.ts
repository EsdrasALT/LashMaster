import { Injectable, signal } from '@angular/core';
import { Cliente } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  // Lista inicial vazia ou com um exemplo
  private lista = signal<Cliente[]>([
    {
      id: '1',
      nome: 'Mariana Oliveira',
      telefone: '11999999999',
      cep: '01001000',
      endereco: 'Praça da Sé, São Paulo - SP',
      anamnese: {
        alergias: 'Nenhuma',
        formatoOlho: 'Amendoado',
        observacoes: 'Sensibilidade leve no olho esquerdo.'
      }
    }
  ]);

  clientes = this.lista.asReadonly();

  adicionar(novo: Cliente) {
    this.lista.update(atual => [...atual, novo]);
  }

  atualizar(editado: Cliente) {
    this.lista.update(atual => 
      atual.map(c => c.id === editado.id ? editado : c)
    );
  }

  remover(id: string) {
    this.lista.update(atual => atual.filter(c => c.id !== id));
  }
}