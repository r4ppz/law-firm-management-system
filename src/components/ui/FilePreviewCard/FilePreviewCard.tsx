"use client";

import {
  FaRegFile,
  FaRegFileExcel,
  FaRegFileImage,
  FaRegFileLines,
  FaRegFilePdf,
  FaRegFileWord,
  FaRegFileZipper,
} from "react-icons/fa6";
import type { IconType } from "react-icons/lib";

import { formatFileSize } from "@/lib/format";

import styles from "./FilePreviewCard.module.css";

interface FileTypeConfig {
  icon: IconType;
  label: string;
  color: string;
}

function getFileTypeConfig(fileType: string): FileTypeConfig {
  const type = fileType.toLowerCase();

  if (type.includes("pdf")) {
    return { icon: FaRegFilePdf, label: "PDF Document", color: "var(--raw-brick)" };
  }

  if (type.includes("word") || type.includes("document") || type.includes("doc")) {
    return { icon: FaRegFileWord, label: "Word Document", color: "var(--raw-steel)" };
  }

  if (
    type.includes("excel") ||
    type.includes("spreadsheet") ||
    type.includes("sheet") ||
    type.includes("xls")
  ) {
    return { icon: FaRegFileExcel, label: "Spreadsheet", color: "var(--raw-sage)" };
  }

  if (
    type.includes("image") ||
    type.includes("png") ||
    type.includes("jpg") ||
    type.includes("jpeg") ||
    type.includes("gif")
  ) {
    return { icon: FaRegFileImage, label: "Image", color: "var(--raw-violet)" };
  }

  if (
    type.includes("zip") ||
    type.includes("rar") ||
    type.includes("tar") ||
    type.includes("gz") ||
    type.includes("archive")
  ) {
    return { icon: FaRegFileZipper, label: "Archive", color: "var(--raw-amber)" };
  }

  if (type.includes("text") || type.includes("csv")) {
    return { icon: FaRegFileLines, label: "Text File", color: "var(--raw-gray-500)" };
  }

  return { icon: FaRegFile, label: "File", color: "var(--raw-gray-400)" };
}

interface FilePreviewCardProps {
  file_name: string;
  file_type: string;
  file_size: number | null;
  uploadedBy: string;
  created_at: Date;
}

export function FilePreviewCard({
  file_name,
  file_type,
  file_size,
  uploadedBy,
  created_at,
}: FilePreviewCardProps) {
  const { icon: Icon, label, color } = getFileTypeConfig(file_type);

  const dateStr = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(created_at);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div
          className={styles.iconContainer}
          style={{ "--file-icon-color": color } as React.CSSProperties}
        >
          <Icon className={styles.icon} />
        </div>
        <div className={styles.info}>
          <span className={styles.fileName}>{file_name}</span>
          <div className={styles.meta}>
            <span>{label}</span>
            <span className={styles.separator} aria-hidden="true">
              ·
            </span>
            <span>{formatFileSize(file_size)}</span>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <span>Uploaded by {uploadedBy}</span>
        <span className={styles.separator} aria-hidden="true">
          ·
        </span>
        <span>{dateStr}</span>
      </div>
    </div>
  );
}
