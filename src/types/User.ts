import type { Venda } from "./Venda";

export type AuthenticatedUser = {
  id: string;
  email: string;
  name:string;
}

export type CreateUserDTO = {
  email: string;
  name: string;
  data_nascimento: Date;
}

export type User = {
  id: string;
  email: string;
  nome: string;
  data_nascimento: string;
  vendas: Venda[];
  letraFaltante: string;
  total: number;
  media: number;
  frequencia: number;
}