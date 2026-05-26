import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // Signals para expor os dados de forma reativa
  umidade = signal<number | null>(null);
  temperatura = signal<number | null>(null);
  statusCola = signal<string>('Carregando clima...');

  // Coordenadas padrão de Belo Horizonte
  private lat = -19.92;
  private lon = -43.94;
  private url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current=relative_humidity_2m,temperature_2m`;

  constructor() {
    this.buscarDadosClimaticos();
  }

  async buscarDadosClimaticos() {
    try {
      const resposta = await fetch(this.url);
      const dados = await resposta.json();
      
      const umidadeAtual = dados.current.relative_humidity_2m;
      const tempAtual = dados.current.temperature_2m;

      this.umidade.set(umidadeAtual);
      this.temperatura.set(tempAtual);

      // Regra de Domínio: Cola de cílios funciona melhor entre 40% e 60% de umidade
      if (umidadeAtual >= 40 && umidadeAtual <= 60) {
        this.statusCola.set('Ideal para a secagem da sua cola.');
      } else if (umidadeAtual < 40) {
        this.statusCola.set('Ar muito seco! A cola pode demorar a secar.');
      } else {
        this.statusCola.set('Ar muito úmido! A cola pode secar rápido demais.');
      }
    } catch (erro) {
      console.error('Erro ao buscar API de clima:', erro);
      this.statusCola.set('Não foi possível carregar os dados de umidade.');
    }
  }
}