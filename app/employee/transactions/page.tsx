import { EmployeeTransactionsPage } from "@/modules/dashboard/employee/pages/TransactionsPage";
import { getTransactionsPageData } from "@/modules/dashboard/employee/lib/getTransactionsPageData.server";
import type { TransactionsSearchParams } from "@/modules/dashboard/employee/types/transactions.types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Transacciones",
  description: "Historial y análisis de tus transacciones bancarias.",
};

interface PageProps {
  searchParams: Promise<TransactionsSearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getTransactionsPageData(params);

  return <EmployeeTransactionsPage data={data} />;
}
