import type { Venda } from "./Venda";

export type MonthChartData = {
  month: string;
  [key: string]: string | number; // Allow both string for 'data' and number for client counts
};

export interface VendaComIdCliente extends Venda {
  idCliente: string;
}