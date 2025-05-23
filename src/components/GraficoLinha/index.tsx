import { useEffect, useMemo, useState } from "react";
import { LineChart, XAxis, Line, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import { selectClients, selectLoadingClients } from "../../redux/clientSlice";
import moment from "moment";
import type { User } from "../../types/User";
import { useSelector } from "react-redux";
import type { Venda } from "../../types/Venda";
import type { MonthChartData, VendaComIdCliente } from "../../types/Charts";
import { createChartConfig } from "../../lib/utils";
import { ChartPlaceholder } from "../ChartPlaceholder";


const processarVendasClientes = (clientes: User[]): VendaComIdCliente[] => {
  return clientes
    .reduce((acc: VendaComIdCliente[], cliente: User) => {
      const vendasComIdDoCliente = cliente.vendas.map((venda: Venda) => {
        return {
          ...venda,
          idCliente: cliente.id,
        } as VendaComIdCliente;
      });
      return [...acc, ...vendasComIdDoCliente];
    }, [])
    .sort((a, b) => moment(a.data).diff(moment(b.data)));
};

const processarVendasPorMes = (
  vendas: VendaComIdCliente[]
): MonthChartData[] => {
  const vendasPorMes = vendas.reduce(
    (acc: MonthChartData[], venda: VendaComIdCliente) => {
      const month = moment(venda.data).format("DD/MM");
      const dataJaNoArray = acc.find((item) => item.month === month);

      if (dataJaNoArray) {
        // Date exists in the accumulator
        const vendedorJaNoArray = dataJaNoArray[venda.idCliente];
        const newValue = {
          ...dataJaNoArray,
          [venda.idCliente]: Number(vendedorJaNoArray || 0) + 1,
        };
        return acc.map((item) => (item.month === month ? newValue : item));
      }

      // Date doesn't exist, add a new entry
      return [...acc, { month, [venda.idCliente]: 1 }];
    },
    []
  );

  return vendasPorMes;
};

export function GraficoLinha() {
  const [chartData, setChartData] = useState<MonthChartData[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const loadingClients = useSelector(selectLoadingClients);
  const clients = useSelector(selectClients);

  const memoizedClients = useMemo(() => clients, [JSON.stringify(clients)]);

  useEffect(() => {
    if (!loadingClients && clients.length > 0) {
      setChartConfig(createChartConfig(clients));
      const todasVendas = processarVendasClientes(clients);
      const vendasPorMes = processarVendasPorMes(todasVendas);
      setChartData(vendasPorMes);
    }
  }, [memoizedClients, loadingClients]);

  if (loadingClients || chartData.length === 0 || !chartConfig) {
    return (
      <ChartPlaceholder />
    );
  }

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 25, right: 25, bottom: 25, left: 25 }}
      >
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 5)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent className="bg-black text-white" hideLabel />}
        />
        <CartesianGrid vertical={false} strokeWidth={0.2} />
        {Object.keys(chartConfig).map((key, idx) => {
          const colorIndex = (idx % 5) + 1;
          return (
            <Line
              dataKey={key}
              type="natural"
              stroke={`var(--chart-${colorIndex})`}
              strokeWidth={10}
              dot={{
                fill: `var(--chart-${colorIndex})`,
              }}
              activeDot={{
                r: 6,
              }}
            />
          );
        })}
      </LineChart>
    </ChartContainer>
  );
}
