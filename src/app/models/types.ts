export interface Tecnica {
  id: string;
  nome: string;
  preco: number;
  tempoEstimado: string; // Ex: "1h 30m"
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  cep: string;
  endereco?: string;
  anamnese: {
    alergias: string;
    formatoOlho: string;
    observacoes: string;
  };
}

export interface Inventario {
  dataAberturaCola: string | null; // ISO Date string
  diasValidade: number; // Geralmente 30
}

export interface Agendamento {
  id: string;
  clienteNome: string;
  horario: string;
  tecnicaNome: string;
}