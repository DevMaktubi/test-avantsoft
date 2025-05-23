import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import type { AppDispatch } from "../config/store";
import { Card } from "../components/ui/card";
import { GraficoLinha } from "../components/GraficoLinha";
import { GraficoBarras } from "../components/GraficoBarras";
import { GraficoPie } from "../components/GraficoPie";
import { TableClientes } from "../components/tables/Clientes";
import { useEffect } from "react";
import { getClientData } from "../redux/clientSlice/asyncThunks";
import { selectClients, selectLoadingClients } from "../redux/clientSlice";
import { ChartPlaceholder } from "../components/ChartPlaceholder";
import { Button } from "../components/ui/button";
import { logoutUser } from "../redux/authSlice/asyncThunks";
import { selectorLoadingAuthentication } from "../redux/authSlice";
import { FormUsuario } from "../components/FormUsuario";
import { Modal } from "../components/ui/modal";
import { UserPlus } from "lucide-react";
import { PodioCampeoes } from "../components/Podio";

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getClientData());
  }, []);

  const clients = useSelector(selectClients);
  const loadingClients = useSelector(selectLoadingClients);

  const loadingAuth = useSelector(selectorLoadingAuthentication)

  const totalVendas = clients.reduce((acc, client) => {
    const sales = client.vendas.reduce((sum, sale) => sum + sale.valor, 0);
    return acc + sales;
  }, 0);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-[var(--secondary)]">
      <div className="grid grid-cols-12 grid-rows-3 gap-4 w-full h-screen px-16 py-8">
        <Card className="col-span-4 3 4 bg-[#1A161E] w-full h-full rounded-lg flex flex-col p-8">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-[#F99218] font-bold text-4xl">Dashboard</h2>
            <Button className="bg-[#F99218] text-neutral-900 font-bold cursor-pointer" onClick={() => dispatch(logoutUser())}>{loadingAuth ? "Saindo" : "Sair"}</Button>
          </div>
          {loadingClients ? (
            <ChartPlaceholder />
          ) : (
            <h1 className="m-0 text-[#F99218] font-bold text-8xl">
              {totalVendas || 0}
            </h1>
          )}
          <h3 className="m-0 text-[#f99218] font-bold text-xl">
            Vendas totais nos últimos 3 meses
          </h3>
        </Card>
        <Card className="col-span-8 bg-[#1A161E] w-full h-full rounded-lg flex flex-col p-4 overflow-hidden">
          <GraficoLinha />
        </Card>        <Card className="col-span-4 bg-[#1A161E] w-full h-full rounded-lg flex flex-col p-4">
          <GraficoBarras />
        </Card>
        <Card className="col-span-4 bg-[#1A161E] w-full h-full rounded-lg flex flex-col p-4 overflow-auto">
          <PodioCampeoes />
        </Card><Card className="col-span-4 row-span-2 bg-[#1A161E] w-full h-full rounded-lg flex flex-col p-8">
          <GraficoPie />
        </Card>
        <Card className="col-span-8 bg-[#1A161E] w-full h-full rounded-lg flex flex-col p-3">
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto">
              <TableClientes />
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                className="bg-[#F99218] text-neutral-900 font-bold cursor-pointer flex items-center gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <UserPlus size={18} />
                Criar cliente
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Novo Cliente"
        className="bg-[#1A161E] border-[#F99218]"
      >
        <FormUsuario closeModal={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
