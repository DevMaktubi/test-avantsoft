import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  selectClients,
  selectLoadingClients,
} from "../../../redux/clientSlice";
import type { User } from "../../../types/User";
import type { Venda } from "../../../types/Venda";
import moment from "moment";
import { calcularLetraFaltante, maskBRL } from "../../../lib/utils";
import { Skeleton } from "../../ui/skeleton";

export function TableClientes() {
  const loadingClients = useSelector(selectLoadingClients);
  const clients = useSelector(selectClients);

  const clientes = clients.map((client: User) => {
    const totalVendas = client.vendas.reduce((acc, venda: Venda) => {
      return acc + venda.valor;
    }, 0);

    // Agrupar vendas por data e calcular media de vendas por dia
    const vendasPorData = client.vendas.reduce((acc: any, venda: Venda) => {
      const data = moment(venda.data).format("DD/MM/YYYY");
      acc[data] = (acc[data] || 0) + 1;
      return acc;
    }, {});

    const mediaVendasPorDia =
      Object.values(vendasPorData).reduce((acc: number, count: any) => {
        return acc + (count as number);
      }, 0) / Object.keys(vendasPorData).length;

    const mediaValorVenda = totalVendas / client.vendas.length;

    return {
      id: client.id,
      nome: client.nome,
      email: client.email,
      data_nascimento: client.data_nascimento,
      vendas: client.vendas,
      totalVendas: totalVendas || 0,
      mediaValorVenda: mediaValorVenda || 0,
      mediaVendasPorDia: mediaVendasPorDia || 0,
    };
  });

  return (
    <div className="w-full h-full overflow-x-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[var(--primary)] text-xl">
              Cliente
            </TableHead>
            <TableHead className="text-[var(--primary)] text-xl">
              Email
            </TableHead>
            <TableHead className="text-[var(--primary)] text-xl text-center">
              Data de nascimento
            </TableHead>
            <TableHead className="text-[var(--primary)] text-xl text-center">
              PLF
            </TableHead>
            <TableHead className="text-[var(--primary)] text-xl text-center">
              Frequência
            </TableHead>
            <TableHead className="text-[var(--primary)] text-xl text-center">
              Média
            </TableHead>
            <TableHead className="text-[var(--primary)] text-xl text-center">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loadingClients &&
            clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="text-[var(--primary)] text-lg max-w-[250px]">
                  <div className="truncate whitespace-normal break-words">
                    {cliente.nome || "-"}
                  </div>
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg">
                  {cliente.email || "-"}
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg text-center">
                  {moment(cliente.data_nascimento).format("DD/MM/YYYY") || "-"}
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg text-center">
                  <div className="bg-[var(--primary)] w-8 h-8 mx-auto rounded flex items-center justify-center text-black">
                    {calcularLetraFaltante(cliente.nome)}
                  </div>
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg text-center">
                  {cliente.mediaVendasPorDia} VPD
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg text-center">
                  R$ {maskBRL(cliente.mediaValorVenda)}
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg text-center">
                  R$ {maskBRL(cliente.totalVendas)}
                </TableCell>
              </TableRow>
            ))}
          {loadingClients &&
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="text-[var(--primary)] text-lg">
                  <Skeleton className="animate-pulse bg-gray-700 h-6 w-full rounded-md"></Skeleton>
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg">
                  <Skeleton className="animate-pulse bg-gray-700 h-6 w-full rounded-md"></Skeleton>
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg">
                  <Skeleton className="animate-pulse bg-gray-700 h-6 w-full rounded-md"></Skeleton>
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg">
                  <Skeleton className="animate-pulse bg-gray-700 h-6 w-full rounded-md"></Skeleton>
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg">
                  <Skeleton className="animate-pulse bg-gray-700 h-6 w-full rounded-md"></Skeleton>
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg">
                  <Skeleton className="animate-pulse bg-gray-700 h-6 w-full rounded-md"></Skeleton>
                </TableCell>
                <TableCell className="text-[var(--primary)] text-lg">
                  <Skeleton className="animate-pulse bg-gray-700 h-6 w-full rounded-md"></Skeleton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
