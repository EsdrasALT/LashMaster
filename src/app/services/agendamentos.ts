import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

// Definição da estrutura do objeto para o TypeScript
export interface Agendamento {
  id?: string;
  clienteNome: string;
  tecnicaNome: string;
  horario: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentosService {
  private firestore = inject(Firestore);
  
  // O Signal que a sua AgendaPage já lê permanece com o mesmo nome
  agendas = signal<Agendamento[]>([]);

constructor() {
    // CORREÇÃO: Aguarda 3 segundos para abrir a conexão com o Firestore, liberando o LCP
    setTimeout(() => {
      this.escutarAgendamentosDoBanco();
    }, 7000);
  }
  private escutarAgendamentosDoBanco() {
    // Aponta para a coleção 'agendamentos' no Firestore
    const colecaoRef = collection(this.firestore, 'agendamentos');
    
    // Liga o escutador em tempo real. O 'idField' injeta o ID do documento no objeto
    collectionData(colecaoRef, { idField: 'id' }).subscribe({
      next: (dadosDoBanco) => {
        // Atualiza o Signal automaticamente. A tela vai reagir sozinha!
        this.agendas.set(dadosDoBanco as Agendamento[]);
      },
      error: (erro) => {
        console.error('Erro ao conectar com o Firestore:', erro);
      }
    });
  }
}