import type { User } from "../../types/User";
import {
  calcularLetraFaltante,
  formatarData,
  createChartConfig,
  maskBRL,
} from "../utils";

// Mock for moment
jest.mock("moment", () => {
  return (date: string) => ({
    format: (format: string) => {
      if (format === "DD/MM/YYYY") {
        return "01/01/2023";
      }
      return date;
    },
  });
});

describe("utils functions", () => {
  describe("calcularLetraFaltante", () => {
    test("deve retornar a primeira letra do alfabeto que não está no nome", () => {
      // Nome sem a letra Q
      expect(calcularLetraFaltante("John Doe")).toBe("Q");

      // Nome sem a letra K
      expect(calcularLetraFaltante("Pedro Augusto")).toBe("K");

      // Nome com todas as letras do alfabeto
      expect(
        calcularLetraFaltante("The quick brown fox jumps over the lazy dog")
      ).toBe("-");
    });

    test("deve ignorar caracteres não-alfabéticos", () => {
      expect(calcularLetraFaltante("John123")).toBe("Q");
    });

    test("deve ser case-insensitive", () => {
      expect(calcularLetraFaltante("john")).toBe("Q");
      expect(calcularLetraFaltante("JOHN")).toBe("Q");
    });
  });

  describe("formatarData", () => {
    test("deve formatar a data no padrão DD/MM/YYYY", () => {
      expect(formatarData("2023-01-01")).toBe("01/01/2023");
    });
  });

  describe("createChartConfig", () => {
    test("deve criar configuração de cores para gráficos com base nos clientes", () => {
      const clients: User[] = [
        {
          id: "1",
          nome: "Cliente Um",
          email: "cliente1@example.com",
          data_nascimento: "2000-01-01",
          letraFaltante: "Q",
          total: 0,
          vendas: [],
          media: 0,
          frequencia: 0,
        },
        {
          id: "2",
          nome: "Cliente Dois",
          email: "cliente2@example.com",
          data_nascimento: "2000-01-01",
          letraFaltante: "Q",
          total: 0,
          vendas: [],
          media: 0,
          frequencia: 0,
        },
        {
          id: "3",
          nome: "Cliente Três",
          email: "cliente3@example.com",
          data_nascimento: "2000-01-01",
          letraFaltante: "Q",
          total: 0,
          vendas: [],
          media: 0,
          frequencia: 0,
        },
        {
          id: "4",
          nome: "Cliente Quatro",
          email: "cliente4@example.com",
          data_nascimento: "2000-01-01",
          letraFaltante: "Q",
          total: 0,
          vendas: [],
          media: 0,
          frequencia: 0,
        },
        {
          id: "5",
          nome: "Cliente Cinco",
          email: "cliente5@example.com",
          data_nascimento: "2000-01-01",
          letraFaltante: "Q",
          total: 0,
          vendas: [],
          media: 0,
          frequencia: 0,
        },
        {
          id: "6",
          nome: "Cliente Seis",
          email: "cliente6@example.com",
          data_nascimento: "2000-01-01",
          letraFaltante: "Q",
          total: 0,
          vendas: [],
          media: 0,
          frequencia: 0,
        },
      ];

      const config = createChartConfig(clients);

      // Verificar se todos os clientes estão no config
      expect(Object.keys(config)).toHaveLength(6);

      // Verificar se os labels foram extraídos corretamente
      expect(config["1"].label).toBe("Cliente");
      expect(config["2"].label).toBe("Cliente");

      // Verificar se as cores estão ciclando corretamente
      expect(config["1"].color).toBe("var(--chart-1)");
      expect(config["2"].color).toBe("var(--chart-2)");
      expect(config["3"].color).toBe("var(--chart-3)");
      expect(config["4"].color).toBe("var(--chart-4)");
      expect(config["5"].color).toBe("var(--chart-5)");
      expect(config["6"].color).toBe("var(--chart-1)"); // Deve voltar à primeira cor
    });

    test("deve usar ID quando o nome não está disponível", () => {
      const clients: User[] = [
        {
          id: "1",
          nome: "",
          email: "cliente1@example.com",
          data_nascimento: "2000-01-01",
          letraFaltante: "Q",
          total: 0,
          vendas: [],
          media: 0,
          frequencia: 0,
        },
      ];

      const config = createChartConfig(clients);
      expect(config["1"].label).toBe("Client 1");
    });
  });

  describe("maskBRL", () => {
    test("deve formatar valores numéricos em formato de moeda brasileira", () => {
      expect(maskBRL(1000)).toBe("1.000,00");
      expect(maskBRL(1500.5)).toBe("1.500,50");
      expect(maskBRL(1500.55)).toBe("1.500,55");
      expect(maskBRL(0)).toBe("0,00");
    });

    test("deve formatar strings numéricas em formato de moeda brasileira", () => {
      expect(maskBRL("1000")).toBe("1.000,00");
      expect(maskBRL("1500.5")).toBe("1.500,50");
    });

    test("deve retornar 0,00 para valores vazios", () => {
      expect(maskBRL("")).toBe("0,00");
      expect(maskBRL(null)).toBe("0,00");
      expect(maskBRL(undefined)).toBe("0,00");
    });
  });
});
