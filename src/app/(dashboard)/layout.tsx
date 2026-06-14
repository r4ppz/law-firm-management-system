import { cookies } from "next/headers";

import { Header } from "@/components/layout/Header/Header";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { ToastRegion } from "@/components/ui/Toast/Toast";
import { auth } from "@/lib/auth";

import styles from "./layout.module.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const cookieStore = await cookies();
  const initialCollapsed = cookieStore.get("sidebar-collapsed")?.value === "true";

  return (
    <div className={styles.layout}>
      <Sidebar initialCollapsed={initialCollapsed} />
      <div className={styles.main}>
        <Header userImage={session?.user?.image ?? null} userName={session?.user?.name} />
        <main className={styles.content}>{children}</main>
      </div>
      <ToastRegion />
    </div>
  );
}
