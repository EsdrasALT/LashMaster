// src/app/services/tecnicas.ts
import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import {
  Firestore, collection, collectionData,
  addDoc, updateDoc, deleteDoc, doc
} from '@angular/fire/firestore';
import { afterNextRender } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tecnica } from '../models/types';

@Injectable({ providedIn: 'root' })
export class TecnicasService implements OnDestroy {
  private firestore = inject(Firestore);
  private subscription?: Subscription;

  private lista = signal<Tecnica[]>([]);
  tecnicas = this.lista.asReadonly();   // API pública idêntica à versão anterior

  constructor() {
    this.escutar(); // Chamada direta!
  }

  private escutar() {
    const ref = collection(this.firestore, 'tecnicas');
    this.subscription = collectionData(ref, { idField: 'id' }).subscribe({
      next:  (dados) => this.lista.set(dados as Tecnica[]),
      error: (err)   => console.error('Erro técnicas:', err),
    });
  }

  async adicionar(nova: Omit<Tecnica, 'id'>): Promise<void> {
    const ref = collection(this.firestore, 'tecnicas');
    await addDoc(ref, nova);
  }

  async atualizar(editada: Tecnica): Promise<void> {
    const { id, ...dados } = editada;
    const ref = doc(this.firestore, 'tecnicas', id);
    await updateDoc(ref, dados as Record<string, any>);
  }

  async deletar(id: string): Promise<void> {
    const ref = doc(this.firestore, 'tecnicas', id);
    await deleteDoc(ref);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
