// src/app/services/clientes.ts
import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import {
  Firestore, collection, collectionData,
  addDoc, updateDoc, deleteDoc, doc
} from '@angular/fire/firestore';
import { afterNextRender } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cliente } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ClientesService implements OnDestroy {
  private firestore = inject(Firestore);
  private subscription?: Subscription;

  private lista = signal<Cliente[]>([]);
  clientes = this.lista.asReadonly();

  constructor() {
    this.escutar(); // Chamada direta!
  }

  private escutar() {
    const ref = collection(this.firestore, 'clientes');
    this.subscription = collectionData(ref, { idField: 'id' }).subscribe({
      next:  (dados) => this.lista.set(dados as Cliente[]),
      error: (err)   => console.error('Erro clientes:', err),
    });
  }

  async adicionar(novo: Omit<Cliente, 'id'>): Promise<void> {
    const ref = collection(this.firestore, 'clientes');
    await addDoc(ref, novo);
  }

  async atualizar(editado: Cliente): Promise<void> {
    const { id, ...dados } = editado;
    const ref = doc(this.firestore, 'clientes', id);
    await updateDoc(ref, dados as Record<string, any>);
  }

  async remover(id: string): Promise<void> {
    const ref = doc(this.firestore, 'clientes', id);
    await deleteDoc(ref);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
