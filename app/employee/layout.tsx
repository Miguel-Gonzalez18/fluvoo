import EmployeeLayout from "@/modules/dashboard/employee/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <EmployeeLayout>{children}</EmployeeLayout>;
}
