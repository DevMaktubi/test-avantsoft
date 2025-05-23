import type { User } from "../types/User";
import { calcularLetraFaltante } from "./utils";

export function formatarClientesParaReducer(
  clientes: Array<{
    info: {
      id: string;
      nomeCompleto: string;
      detalhes: {
        email: string;
        nascimento: string;
      };
    };
    duplicado?: {
      nomeCompleto: string;
    };
    estatisticas: {
      vendas: Array<{ data: string; valor: number }>;
    };
  }>
): User[] {
  const clientesBase = clientes
    .map((cliente, idx, arr) => {
      // Verifica se o cliente já existe na lista, para o caso de dados duplicados vindos do backend
      if (
        arr.find((c) => c.info.id === cliente.info.id && arr.indexOf(c) !== idx)
      ) {
        return null;
      }
      return {
        id: cliente.info.id,
        email: cliente.info.detalhes.email,
        nome: cliente.info.nomeCompleto,
        data_nascimento: cliente.info.detalhes.nascimento,
        vendas: cliente.estatisticas.vendas.map((venda) => ({
          data: venda.data,
          valor: venda.valor,
        })),
      };
    })
    .filter((cliente) => cliente !== null);

  return clientesBase.map((cliente) => {
    const total = cliente.vendas.reduce((sum, venda) => sum + venda.valor, 0);
    return {
      ...cliente,
      letraFaltante: calcularLetraFaltante(cliente.nome),
      total: total,
      media: total / cliente.vendas.length,
      frequencia: cliente.vendas.length,
    };
  });
}
