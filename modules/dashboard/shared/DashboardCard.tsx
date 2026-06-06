import { cn } from "@/lib/utils";
import { Card } from "@/modules/shared/components/ui/card";

export function DashboardCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return <Card className={cn("border-0 shadow-none", className)} {...props} />;
}
