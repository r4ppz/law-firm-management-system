import { DashboardContent } from "@/features/dashboard/components/DashboardContent/DashboardContent";
import {
  getDashboardStats,
  getOverdueMilestones,
  getRecentCases,
  getUpcomingConsultations,
} from "@/features/dashboard/queries";

import styles from "./page.module.css";

function fulfilledOrNull<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === "fulfilled" ? result.value : null;
}

export default async function DashboardPage() {
  const [statsResult, recentCasesResult, upcomingConsultationsResult, overdueMilestonesResult] =
    await Promise.allSettled([
      getDashboardStats(),
      getRecentCases(),
      getUpcomingConsultations(),
      getOverdueMilestones(),
    ]);

  const stats = fulfilledOrNull(statsResult);
  const recentCases = fulfilledOrNull(recentCasesResult);
  const upcomingConsultations = fulfilledOrNull(upcomingConsultationsResult);
  const overdueMilestones = fulfilledOrNull(overdueMilestonesResult);

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
