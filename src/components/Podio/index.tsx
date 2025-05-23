import { useSelector } from "react-redux";
import { selectClients, selectLoadingClients } from "../../redux/clientSlice";
import { ChartPlaceholder } from "../ChartPlaceholder";
import { Crown } from "lucide-react";
import moment from "moment";
import type { Venda } from "../../types/Venda";

export function PodioCampeoes() {
  const loadingClients = useSelector(selectLoadingClients);
  const clients = useSelector(selectClients);

  // Return placeholder while loading
  if (loadingClients || clients.length === 0) {
    return <ChartPlaceholder />;
  }

  // Calcula um unico cliente com maior quantidade de vendas entre todos
  const clientesFormatados = clients.map((client) => {
    const totalVendas = client.vendas.reduce(
      (acc, venda) => acc + venda.valor,
      0
    );

    const vendasAgrupadasPorData = client.vendas.reduce((acc: Array<string>, venda:Venda) => {
      const dataVenda = moment(venda.data).format("YYYY-MM-DD");
      const dataJaNoArray = acc.find((item) => item === dataVenda);
      if(dataJaNoArray) return acc
      return [...acc, dataVenda]
    }, []);

    return {
      ...client,
      totalVendas,
      mediaVendas: totalVendas / client.vendas.length || 0,
      diasComVendas: vendasAgrupadasPorData.length,
    };
  });

  const maiorVolumeVendas = clientesFormatados.sort((a,b) => b.vendas.length - a.vendas.length)[0];
  const maiorFaturamento = clientesFormatados.sort((a,b) => b.totalVendas - a.totalVendas)[0];
  const maiorVolume = clientesFormatados.sort((a,b) => b.diasComVendas - a.diasComVendas)[0];
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h2 className="text-[var(--primary)] text-2xl font-bold mb-8">
        Índices de vendas
      </h2>

      <div className="grid grid-cols-2 items-center justify-center w-full h-full">
        <div className="col-span-1 flex items-center justify-center w-full bg-[#1A161E] rounded-lg p-4 mb-4">
          <Crown className="h-8 w-8 text-[var(--chart-1)] mr-2" />
          <div className="flex flex-col items-start">
            <h3 className="text-[var(--primary)] font-bold text-xl">
              {maiorVolumeVendas.nome}
            </h3>
            <p className="text-[var(--primary)] text-sm">
              Quantidade de vendas
            </p>
          </div>
        </div>
        <div className="col-span-1 flex items-center justify-center w-full bg-[#1A161E] rounded-lg p-4 mb-4">
          <Crown className="h-8 w-8 text-[var(--chart-1)] mr-2" />
          <div className="flex flex-col items-start">
            <h3 className="text-[var(--primary)] font-bold text-xl">
              {maiorFaturamento.nome}
            </h3>
            <p className="text-[var(--primary)] text-sm">Maior faturamento</p>
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-center w-full bg-[#1A161E] rounded-lg p-4 mb-4">
          <Crown className="h-8 w-8 text-[var(--chart-1)] mr-2" />
          <div className="flex flex-col items-start">
            <h3 className="text-[var(--primary)] font-bold text-xl">
              {maiorVolume.nome || "-"}
            </h3>
            <p className="text-[var(--primary)] text-sm">
              Volume de vendas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
