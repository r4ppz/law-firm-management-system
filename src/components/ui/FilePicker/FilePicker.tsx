"use client";

import clsx from "clsx";
import { useCallback } from "react";
import {
  DropZone,
  FileTrigger,
  isFileDropItem,
  Text,
  type DropZoneProps,
} from "react-aria-components";

import { Button } from "@/components/ui/Button/Button";

import styles from "./FilePicker.module.css";

export interface FilePickerProps {
  onFileSelect: (files: File[]) => void;
  acceptedFileTypes?: readonly string[];
  allowsMultiple?: boolean;
  acceptDirectory?: boolean;
  isDisabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export function FilePicker({
  onFileSelect,
  acceptedFileTypes,
  allowsMultiple,
  acceptDirectory,
  isDisabled,
  label = "Drag & drop files here",
  description,
  className,
}: FilePickerProps) {
  const handleDrop = useCallback<NonNullable<DropZoneProps["onDrop"]>>(
    async (event) => {
      const files: File[] = [];
      for (const item of event.items) {
        if (isFileDropItem(item)) {
          files.push(await item.getFile());
        }
      }
      if (files.length > 0) {
        onFileSelect(files);
      }
    },
    [onFileSelect],
  );

  const handleSelect = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      onFileSelect(Array.from(fileList));
    },
    [onFileSelect],
  );

  return (
    <DropZone
      isDisabled={isDisabled}
      getDropOperation={() => "copy"}
      onDrop={handleDrop}
      className={clsx(styles.dropZone, className)}
    >
      <div className={styles.content}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.icon}
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <Text slot="label" className={styles.label}>
          {label}
        </Text>
        {description && <p className={styles.description}>{description}</p>}
        <FileTrigger
          acceptedFileTypes={acceptedFileTypes}
          allowsMultiple={allowsMultiple}
          acceptDirectory={acceptDirectory}
          onSelect={handleSelect}
        >
          <Button variant="secondary" isDisabled={isDisabled}>
            Browse Files
          </Button>
        </FileTrigger>
      </div>
    </DropZone>
  );
}
