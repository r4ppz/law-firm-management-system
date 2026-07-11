"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";
import { TextField } from "@/components/ui/TextField/TextField";
import { queue } from "@/components/ui/Toast/Toast";
import { createNoteAction } from "@/features/notes/actions";

import styles from "./AddNoteModal.module.css";

interface AddNoteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  caseId?: string;
  consultationId?: string;
}

export function AddNoteModal({
  isOpen,
  onOpenChange,
  onSuccess,
  caseId,
  consultationId,
}: AddNoteModalProps) {
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);

  function handleCancel() {
    if (isPending) return;
    setContent("");
    onOpenChange(false);
  }

  async function handleSubmit() {
    if (!content.trim()) return;
    setIsPending(true);

    try {
      const result = await createNoteAction({
        content: content.trim(),
        case_id: caseId ?? null,
        consultation_id: consultationId ?? null,
      });

      if (result.success) {
        queue.add({ title: "Note added" }, { timeout: 5000 });
        setContent("");
        onOpenChange(false);
        onSuccess();
      } else {
        queue.add({ title: result.error ?? "Failed to add note" }, { timeout: 5000 });
      }
    } catch {
      queue.add({ title: "Failed to add note" }, { timeout: 5000 });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Modal title="Add Note" isOpen={isOpen} onOpenChange={handleCancel} className={styles.modal}>
      <div className={styles.content}>
        <TextField
          label="Note"
          isTextArea
          rows={5}
          value={content}
          onChange={setContent}
          placeholder="Enter note content..."
          isDisabled={isPending}
        />
        <div className={styles.actions}>
          <Button variant="secondary" onPress={handleCancel} isDisabled={isPending}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} isDisabled={!content.trim() || isPending}>
            {isPending ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
