import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonicModule, 
  AlertController, 
  LoadingController 
} from '@ionic/angular';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  private fb = inject(FormBuilder);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials!: FormGroup;

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const email = this.credentials.get('email')?.value;
      const password = this.credentials.get('password')?.value;

      await this.authService.login(email, password);
      
      this.router.navigateByUrl('/tabs/agenda', { replaceUrl: true });
    } catch (e: any) {
      this.showAlert('Falha no Login', 'E-mail ou senha incorretos.');
    } finally {
      await loading.dismiss();
    }
  }

  // No login.page.ts
  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      // EXTRAÇÃO EXPLÍCITA: Garantimos que são strings
      const email = this.credentials.get('email')?.value;
      const password = this.credentials.get('password')?.value;

      await this.authService.register(email, password);
      // Rota corrigida para bater com o novo app.routes.ts abaixo
      this.router.navigateByUrl('/tabs/agenda', { replaceUrl: true });
    } catch (e: any) {
      this.showAlert('Falha no Registro', 'Verifique os dados ou se o usuário já existe.');
    } finally {
      await loading.dismiss();
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}