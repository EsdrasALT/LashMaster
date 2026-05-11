import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  authState, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User 
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Comente a injeção se quiser silenciar avisos de conexão
  // private auth = inject(Auth); 

  // Simule um usuário logado para não quebrar componentes que dependem de user$
  readonly user$: Observable<any> = new Observable(sub => sub.next({ email: 'dev@teste.com' }));

  constructor() {}

  async login(email: string, pass: string) {
    console.log('Login bypass ativado');
    return true;
  }

  async register(email: string, pass: string) {
    console.log('Registro bypass ativado');
    return true;
  }

  logout() {
    console.log('Logout bypass');
  }
}