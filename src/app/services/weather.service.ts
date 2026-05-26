import { Injectable, signal, inject } from '@angular/core';
import { afterNextRender } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  umidade = signal<number | null>(null);
  temperatura = signal<number | null>(null);
  statusCola = signal<string>('Carregando clima...');

  private lat = -19.92;
  private lon = -43.94;
  private url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current=relative_humidity_2m,temperature_2m`;

  constructor() {
    // Dispara APÓS o primeiro render — libera LCP completamente
    afterNextRender(() => {
      this.buscarDadosClimaticos();
    });
  }

  async buscarDadosClimaticos() {
    try {
      const resposta = await fetch(this.url);
      const dados = await resposta.json();
      const umidadeAtual = dados.current.relative_humidity_2m;

      this.umidade.set(umidadeAtual);
      this.temperatura.set(dados.current.temperature_2m);

      if (umidadeAtual >= 40 && umidadeAtual <= 60) {
        this.statusCola.set('Ideal para a secagem da sua cola.');
      } else if (umidadeAtual < 40) {
        this.statusCola.set('Ar muito seco! A cola pode demorar a secar.');
      } else {
        this.statusCola.set('Ar muito úmido! A cola pode secar rápido demais.');
      }
    } catch {
      this.statusCola.set('Não foi possível carregar os dados de umidade.');
    }
  }
}