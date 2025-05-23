import { createAsyncThunk } from "@reduxjs/toolkit";
import { formatarClientesParaReducer } from "../../lib/funcoes-especificas";

export const getClientData = createAsyncThunk(
  "client/getClientData",
  async () => {
    // Simulação de chamada a um serviço externo
    const response = await new Promise<{
      data: {
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
        }>;
      };
      meta: {
        registroTotal: number;
        pagina: number;
      };
      redundante: {
        status: string;
      };
    }>((resolve) => {
      const mockedResponse = {
        data: {
          clientes: [
            {
              info: {
                id: "ana",
                nomeCompleto: "Ana Beatriz",
                detalhes: {
                  email: "ana.b@example.com",
                  nascimento: "1992-05-01",
                },
              },
              estatisticas: {
                vendas: [
                  { data: "2025-05-07", valor: 300 },
                  { data: "2025-05-14", valor: 321 },
                  { data: "2025-05-14", valor: 152 },
                  { data: "2025-05-18", valor: 152 },
                  { data: "2025-05-18", valor: 152 },
                  { data: "2025-05-21", valor: 152 },
                  { data: "2025-05-21", valor: 152 },
                  { data: "2025-05-05", valor: 50 },
                  { data: "2025-05-09", valor: 150 },
                  { data: "2025-05-11", valor: 510 },
                  { data: "2025-05-17", valor: 130 },
                ],
              },
            },
            {
              info: {
                id: "carlos",
                nomeCompleto: "Carlos Eduardo",
                detalhes: {
                  email: "cadu@example.com",
                  nascimento: "1987-08-15",
                },
              },
              duplicado: {
                nomeCompleto: "Carlos Eduardo",
              },
              estatisticas: {
                vendas: [
                  { data: "2025-05-07", valor: 300 },
                  { data: "2025-05-07", valor: 300 },
                  { data: "2025-05-14", valor: 321 },
                  { data: "2025-05-18", valor: 152 },
                  { data: "2025-05-21", valor: 152 },
                  { data: "2025-05-05", valor: 50 },
                  { data: "2025-05-05", valor: 50 },
                  { data: "2025-05-05", valor: 50 },
                  { data: "2025-05-09", valor: 150 },
                  { data: "2025-05-11", valor: 510 },
                  { data: "2025-05-11", valor: 510 },
                  { data: "2025-05-17", valor: 130 },
                ],
              },
            },
          ],
        },
        meta: {
          registroTotal: 2,
          pagina: 1,
        },
        redundante: {
          status: "ok",
        },
      };
      setTimeout(() => {
        resolve(mockedResponse);
      }, 3000);
    });

    return formatarClientesParaReducer(response.data.clientes);
  }
);
