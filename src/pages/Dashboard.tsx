import { useDispatch } from "react-redux";
import type { AppDispatch } from "../config/store";
import { Card } from "../components/ui/card";
import { GraficoLinha } from "../components/GraficoLinha";
import { GraficoBarras } from "../components/GraficoBarras";
import { GraficoPie } from "../components/GraficoPie";
import { TableClientes } from "../components/tables/Clientes";
import { useEffect } from "react";
import { getClientData } from "../redux/clientSlice/asyncThunks";


export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getClientData());
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-[var(--secondary)]">
      <div className="grid grid-cols-12 grid-rows-3 gap-4 w-full h-screen px-16 py-8">
        <Card className="col-span-4 3 4 bg-stone-700 w-full h-full rounded-lg flex flex-col p-8">
          <h2 className="m-0 text-[#F99218] font-bold text-4xl">Dashboard</h2>
          <h1 className="m-0 text-[#F99218] font-bold text-8xl">23,450</h1>
          <h3 className="m-0 text-[#f99218] font-bold text-xl">
            Vendas totais nos últimos 3 meses
          </h3>
        </Card>
        <Card className="col-span-8 bg-stone-700 w-full h-full rounded-lg flex flex-col p-8 overflow-hidden">
          <GraficoLinha />
        </Card>
        <Card className="col-span-4 bg-stone-700 w-full h-full rounded-lg flex flex-col p-8">
          <GraficoBarras />
        </Card>
        <Card className="col-span-4 bg-stone-700 w-full h-full rounded-lg flex flex-col p-8"></Card>
        <Card className="col-span-4 row-span-2 bg-stone-700 w-full h-full rounded-lg flex flex-col p-8">
          <GraficoPie />
        </Card>
        <Card className="col-span-8 bg-stone-700 w-full h-full rounded-lg flex flex-col p-3">
          <TableClientes />
        </Card>
      </div>
    </div>
  );
}
