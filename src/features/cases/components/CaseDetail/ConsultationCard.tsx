"use client";

import { FaArrowRight } from "react-icons/fa6";

import { Link } from "@/components/ui/Link/Link";

import styles from "./ConsultationCard.module.css";

interface Props {
  consultation: { id: string; concern: string };
}

export function ConsultationCard({ consultation }: Props) {
  return (
    <Link href={`/consultation/${consultation.id}`} className={styles.card}>
      <div className={styles.content}>
        <span className={styles.label}>Source Consultation</span>
        <span className={styles.title}>{consultation.concern}</span>
      </div>
      <FaArrowRight className={styles.arrow} />
    </Link>
  );
}
