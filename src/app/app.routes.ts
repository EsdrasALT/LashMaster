import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'agenda',
        loadComponent: () => import('./pages/agenda/agenda.page').then(m => m.AgendaPage),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./pages/clientes/clientes.page').then(m => m.ClientesPage),
      },
      {
        path: 'tecnicas',
        loadComponent: () => import('./pages/tecnicas/tecnicas.page').then(m => m.TecnicasPage),
      },
      {
        path: 'inventario',
        loadComponent: () => import('./pages/inventario/inventario.page').then(m => m.InventarioPage),
      },
      {
        path: '',
        redirectTo: 'agenda',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'cliente-detalhe/:id',
    loadComponent: () => import('./pages/cliente-detalhe/cliente-detalhe.page').then(m => m.ClienteDetalhePage),
  },
  {
    path: 'cliente-detalhe',
    loadComponent: () => import('./pages/cliente-detalhe/cliente-detalhe.page').then(m => m.ClienteDetalhePage),
  },
];