import { BarChart, XAxis, YAxis, Bar, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectClients, selectLoadingClients } from "../../redux/clientSlice";
import type { MonthChartData, VendaComIdCliente } from "../../types/Charts";
import type { User } from "../../types/User";
import type { Venda } from "../../types/Venda";
import moment from "moment";

const createChartConfig = (clients: User[]): ChartConfig => {
  const config: ChartConfig = {};

  clients.forEach((client, index) => {
    const colorIndex = (index % 5) + 1; // Cycle through 5 chart colors
    config[client.id] = {
      label: client.nome || `Client ${client.id}`,
      color: `var(--chart-${colorIndex})`,
    };
  });

  return config;
};

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
          [venda.idCliente]: Number(vendedorJaNoArray || 0) + venda.valor,
        };
        return acc.map((item) => (item.month === month ? newValue : item));
      }

      // Date doesn't exist, add a new entry
      return [...acc, { month, [venda.idCliente]: venda.valor }];
    },
    []
  );

  return vendasPorMes;
};

export function GraficoBarras() {
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
      <div className="w-full h-full animate-pulse bg-gray-200 rounded-lg" />
    );
  }

  console.log("chartData", chartData);
  console.log("chartConfig", chartConfig);
  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 5)}
          tick={{ fontSize: 12, fill: "var(--text-2)" }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent className="bg-black text-white" hideLabel />}
        />
        {Object.entries(chartConfig).map(([key, value]) => {
          return (
            <Bar
              dataKey={key}
              fill={value.color}
            />
          );
        })}
      </BarChart>
    </ChartContainer>
  );
}
