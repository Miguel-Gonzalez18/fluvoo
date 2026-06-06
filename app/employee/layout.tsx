import EmployeeLayout from "@/modules/dashboard/employee/layout";
import { getEmployeeLayoutData } from "@/modules/dashboard/employee/lib/getEmployeeLayoutData.server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { displayName, gmailStatus } = await getEmployeeLayoutData();

  return (
    <EmployeeLayout displayName={displayName} gmailStatus={gmailStatus}>
      {children}
    </EmployeeLayout>
  );
}
