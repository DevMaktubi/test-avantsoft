import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { alfabeto } from "../constant/constants";
import type { User } from "../types/User";
import type { ChartConfig } from "../components/ui/chart";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calcularLetraFaltante = (nomeCliente: string): string => {
  const nomeClienteFormatado = nomeCliente
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .split("");
  const letrasFaltantes = alfabeto.filter(
    (letra) => !nomeClienteFormatado.includes(letra)
  );
  return letrasFaltantes.length > 0 ? letrasFaltantes[0] : "-";
};

export const formatarData = (data: string): string => {
  return moment(data).format("DD/MM/YYYY");
}


export const createChartConfig = (clients: User[]): ChartConfig => {
  const config: ChartConfig = {};

  clients.forEach((client, index) => {
    const colorIndex = (index % 5) + 1; // Cycle through 5 chart colors
    config[client.id] = {
      label: client.nome.split(" ")[0] || `Client ${client.id}`,
      color: `var(--chart-${colorIndex})`,
    };
  });

  return config;
};

export const maskBRL = (value?: string | number | null) => {
  let response = '0,00'
  if (!value) {
    return response
  }

  let parsed = `${value}`

  try {
    response = Number(parseFloat(parsed)).toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
      currencyDisplay: 'symbol',
    })
  } catch (err) {
    console.error('Erro na conversão de valores')
  }

  return response.replace(/\$|R/g, '').trimStart()
}