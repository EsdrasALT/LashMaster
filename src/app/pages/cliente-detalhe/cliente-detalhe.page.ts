import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonItem, IonLabel, IonInput, IonTextarea, 
  IonSelect, IonSelectOption, IonButton 
} from '@ionic/angular/standalone'; // Importações necessárias 

@Component({
  selector: 'app-cliente-detalhe',
  templateUrl: './cliente-detalhe.page.html',
  styleUrls: ['./cliente-detalhe.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonItem, IonLabel, IonInput, IonTextarea, 
    IonSelect, IonSelectOption, IonButton, CommonModule, FormsModule
  ] // Declarando os componentes para o HTML 
})
export class ClienteDetalhePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}