import { DashboardContent } from "@/features/dashboard/components/DashboardContent/DashboardContent";
import {
  getDashboardStats,
  getOverdueMilestones,
  getRecentCases,
  getUpcomingConsultations,
} from "@/features/dashboard/queries";

import styles from "./page.module.css";

export default async function DashboardPage() {
  const [stats, recentCases, upcomingConsultations, overdueMilestones] = await Promise.all([
    getDashboardStats(),
    getRecentCases(),
    getUpcomingConsultations(),
    getOverdueMilestones(),
  ]);

  return (
    <div className={styles.wrapper}>
      <DashboardContent
        stats={stats}
        recentCases={recentCases}
        upcomingConsultations={upcomingConsultations}
        overdueMilestones={overdueMilestones}
      />
    </div>
  );
}
