"use client";

import { StatCard } from "@/components/ui/StatCard/StatCard";
import { OverdueMilestonesTable } from "@/features/dashboard/components/OverdueMilestonesTable/OverdueMilestonesTable";
import { RecentCasesTable } from "@/features/dashboard/components/RecentCasesTable/RecentCasesTable";
import { UpcomingConsultationsTable } from "@/features/dashboard/components/UpcomingConsultationsTable/UpcomingConsultationsTable";
import type { DashboardStats } from "@/features/dashboard/queries";

import styles from "./DashboardContent.module.css";

interface DashboardContentProps {
  stats: DashboardStats;
}

export function DashboardContent({ stats }: DashboardContentProps) {
  return (
    <div className={styles.dashboard}>
      <div className={styles.statsRow}>
        <StatCard label="Open Cases" value={stats.openCases} accent="open" />
        <StatCard
          label="Today's Consultations"
          value={stats.todayConsultations}
          accent="scheduled"
        />
        <StatCard label="Total Users" value={stats.totalUsers} accent="users" />
        <StatCard label="Overdue Milestones" value={stats.overdueMilestones} accent="overdue" />
      </div>
      <div className={styles.tablesWrapper}>
        <RecentCasesTable />
        <div className={styles.leftTable}>
          <OverdueMilestonesTable />
          <UpcomingConsultationsTable />
        </div>
      </div>
    </div>
  );
}
