"use client";

import type { ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa6";

import { Link } from "@/components/ui/Link/Link";

import styles from "./RelatedLinkCard.module.css";

interface RelatedLinkCardProps {
  href: string;
  label: string;
  title: string;
  icon?: ReactNode;
}

export function RelatedLinkCard({ href, label, title, icon }: RelatedLinkCardProps) {
  return (
    <Link href={href} className={styles.card}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
      <span className={styles.title}>{title}</span>
      <FaArrowRight className={styles.arrow} />
    </Link>
  );
}
