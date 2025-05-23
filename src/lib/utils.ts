import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { alfabeto } from "../constant/constants";

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
