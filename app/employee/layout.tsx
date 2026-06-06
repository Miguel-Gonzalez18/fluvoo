import EmployeeLayout from "@/modules/dashboard/employee/layout";
import { getEmployeeDisplayName } from "@/modules/dashboard/employee/lib/getEmployeeDisplayName.server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const displayName = await getEmployeeDisplayName();

  return (
    <EmployeeLayout displayName={displayName}>{children}</EmployeeLayout>
  );
}
