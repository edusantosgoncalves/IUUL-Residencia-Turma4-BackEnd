//Declarando tipo Moeda (símbolos recebidos em array de ListaMoedas)
type Moeda = {
  code: string;
  description: string;
};

//Declarando tipo ListaMoedas (lista de símbolos recebidos via API)
export type ListaMoedas = {
  symbols: Moeda[];
  success: boolean;
};

//Declarando tipo ConversaoMoeda (resposta recebida via API na conversão)
export type ConversaoMoeda = {
  success: boolean;
  query: { from: string; to: string; amount: number };
  info: { rate: number };
  result: number;
};
