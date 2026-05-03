import { Component, inject, signal, computed } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonSearchbar, IonFab, IonFabButton, IonIcon, IonNote 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { add, personOutline, callOutline } from 'ionicons/icons';
import { ClientesService } from '../../services/clientes';
import { Cliente } from '../../models/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
    IonItem, IonLabel, IonSearchbar, IonFab, IonFabButton, IonIcon, IonNote
  ]
})
export class ClientesPage {
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  
  // Signal para o termo de busca
  searchTerm = signal('');

  // Lista filtrada reativa
  clientesFiltrados = computed(() => {
    const termo = this.searchTerm().toLowerCase();
    return this.clientesService.clientes().filter(c => 
      c.nome.toLowerCase().includes(termo)
    );
  });

  constructor() {
    addIcons({ add, personOutline, callOutline });
  }

  handleSearch(event: any) {
    this.searchTerm.set(event.detail.value || '');
  }

  // Método que chamaremos na próxima etapa
  abrirCadastro(cliente?: Cliente) {
    if (cliente) {
      this.router.navigate(['/cliente-detalhe', cliente.id]);
    } else {
      this.router.navigate(['/cliente-detalhe']);
    }
  }
}