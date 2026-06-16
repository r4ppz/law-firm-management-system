import { DashboardContent } from "@/features/dashboard/components/DashboardContent/DashboardContent";
import { getDashboardStats } from "@/features/dashboard/queries";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return <DashboardContent stats={stats} />;
}
