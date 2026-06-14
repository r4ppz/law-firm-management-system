"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa6";

import { SignOutButton } from "@/features/auth/components/SignOutButton/SignOutButton";

import styles from "./Header.module.css";

export function Header({
  userImage,
  userName,
}: {
  userImage: string | null;
  userName?: string | null;
}) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path.startsWith("/dashboard")) return "Overview";
    if (path.startsWith("/case")) return "Case Management";
    if (path.startsWith("/consultation")) return "Consultation Management";
    if (path.startsWith("/user")) return "User Management";
    return "";
  };

  return (
    <header className={styles.header}>
      <h2 className={styles.pageTitle}>{getPageTitle(pathname || "")}</h2>
      <div className={styles.userSection}>
        <div className={styles.userProfile}>
          {userImage ? (
            <Image src={userImage} alt="Profile" width={32} height={32} className={styles.avatar} />
          ) : (
            <FaUser className={styles.userIcon} />
          )}
        </div>
        {userName && <span className={styles.userName}>{userName}</span>}
        <SignOutButton />
      </div>
    </header>
  );
}
