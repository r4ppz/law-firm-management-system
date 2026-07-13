"use client";

import { StatCard } from "@/components/ui/StatCard/StatCard";
import { OverdueMilestonesTable } from "@/features/dashboard/components/OverdueMilestonesTable/OverdueMilestonesTable";
import { RecentCasesTable } from "@/features/dashboard/components/RecentCasesTable/RecentCasesTable";
import { UpcomingConsultationsTable } from "@/features/dashboard/components/UpcomingConsultationsTable/UpcomingConsultationsTable";
import type {
  DashboardStats,
  OverdueMilestoneRow,
  RecentCaseRow,
  UpcomingConsultationRow,
} from "@/features/dashboard/queries";

import styles from "./DashboardContent.module.css";

interface DashboardContentProps {
  stats: DashboardStats | null;
  recentCases: RecentCaseRow[] | null;
  upcomingConsultations: UpcomingConsultationRow[] | null;
  overdueMilestones: OverdueMilestoneRow[] | null;
}

function ErrorBlock({ message }: { message: string }) {
  return <div className={styles.errorMessage}>{message}</div>;
}

export function DashboardContent({
  stats,
  recentCases,
  upcomingConsultations,
  overdueMilestones,
}: DashboardContentProps) {
  return (
    <div className={styles.dashboard}>
      <div className={styles.statsRow}>
        {stats ? (
          <>
            <StatCard label="Open Cases" value={stats.openCases} accent="open" />
            <StatCard
              label="Today's Consultations"
              value={stats.todayConsultations}
              accent="scheduled"
            />
            <StatCard label="Total Users" value={stats.totalUsers} accent="users" />
            <StatCard label="Overdue Milestones" value={stats.overdueMilestones} accent="overdue" />
          </>
        ) : (
          <ErrorBlock message="Failed to load dashboard statistics" />
        )}
      </div>
      <div className={styles.tablesWrapper}>
        {recentCases ? (
          <RecentCasesTable cases={recentCases} />
        ) : (
          <ErrorBlock message="Failed to load recent cases" />
        )}
        <div className={styles.leftTable}>
          {upcomingConsultations ? (
            <UpcomingConsultationsTable consultations={upcomingConsultations} />
          ) : (
            <ErrorBlock message="Failed to load upcoming consultations" />
          )}
          {overdueMilestones ? (
            <OverdueMilestonesTable milestones={overdueMilestones} />
          ) : (
            <ErrorBlock message="Failed to load overdue milestones" />
          )}
        </div>
      </div>
    </div>
  );
}
