import { PieChart, Pie, Label } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useEffect, useMemo, useState } from "react";
import { selectClients, selectLoadingClients } from "../../redux/clientSlice";
import { useSelector } from "react-redux";
import type { User } from "../../types/User";
import { createChartConfig } from "../../lib/utils";
import { ChartPlaceholder } from "../ChartPlaceholder";
const processarFaturamentoTotalPorCliente = (
  clientes: User[]
): Array<{ [key: string]: number | string }> => {
  return clientes.reduce(
    (acc: Array<{ [key: string]: number | string }>, cliente: User) => {
      const totalFaturamento = cliente.vendas.reduce(
        (total: number, venda) => total + venda.valor,
        0
      );
      const clienteJaNoArray = acc.find((item) => item.cliente === cliente.id);
      if (clienteJaNoArray) {
        // Cliente já existe no array
        const newValue = {
          cliente: cliente.id,
          faturamento: Number(clienteJaNoArray?.faturamento) + totalFaturamento,
          fill: `var(--chart-${(acc.length % 5) + 1})`,
        };
        return acc.map((item) =>
          item.cliente === clienteJaNoArray.cliente ? newValue : item
        );
      }
      const newValue = {
        cliente: cliente.id,
        faturamento: totalFaturamento,
        fill: `var(--chart-${(acc.length % 5) + 1})`,
      };
      return [...acc, newValue];
    },
    []
  );
};

export function GraficoPie() {
  const [chartData, setChartData] = useState<
    { [key: string]: number | string }[]
  >([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const loadingClients = useSelector(selectLoadingClients);
  const clients = useSelector(selectClients);

  const memoizedClients = useMemo(() => clients, [JSON.stringify(clients)]);

  useEffect(() => {
    if (!loadingClients && clients.length > 0) {
      const config = createChartConfig(memoizedClients);
      const faturamentoPorCliente =
        processarFaturamentoTotalPorCliente(memoizedClients);
      setChartData(faturamentoPorCliente);
      setChartConfig(config);
    }
  }, [memoizedClients, loadingClients]);

  if (loadingClients || chartData.length === 0 || !chartConfig) {
    return (
      <ChartPlaceholder />
    );
  }
  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="aspect-square max-h-[350px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent className="bg-black text-white" />}
          />
          <Pie
            data={chartData}
            dataKey="faturamento"
            nameKey="cliente"
            innerRadius={60}
          >
            <Label
              content={({ viewBox }) => {
                const totalVendas = chartData.reduce(
                  (acc, item) => acc + Number(item.faturamento),
                  0
                );
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-white text-3xl font-bold"
                      >
                        {totalVendas}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-white "
                      >
                        Vendas
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-wrap gap-4 justify-center">
        {chartData.map((item,idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-white"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: String(item.fill) }}
            ></div>
            <span className="text-2xl font-bold">
              {item.cliente} - {item.faturamento}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
