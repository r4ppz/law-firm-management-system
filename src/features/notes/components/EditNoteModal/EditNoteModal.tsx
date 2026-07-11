"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { Modal } from "@/components/ui/Modal/Modal";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import { TextField } from "@/components/ui/TextField/TextField";
import { queue } from "@/components/ui/Toast/Toast";
import { deleteNoteAction, updateNoteAction } from "@/features/notes/actions";
import type { NoteRow } from "@/features/notes/queries";

import styles from "./EditNoteModal.module.css";

interface EditNoteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  note: NoteRow;
}

export function EditNoteModal({ isOpen, onOpenChange, onSuccess, note }: EditNoteModalProps) {
  const [content, setContent] = useState(note.content);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleSave() {
    if (!content.trim() || content.trim() === note.content) return;
    setIsPending(true);

    const result = await updateNoteAction({ noteId: note.id, content: content.trim() });

    setIsPending(false);

    if (result.success) {
      queue.add({ title: "Note updated" }, { timeout: 5000 });
      onOpenChange(false);
      onSuccess();
    } else {
      queue.add({ title: result.error ?? "Failed to update note" }, { timeout: 5000 });
    }
  }

  async function handleDelete() {
    setIsLoading(true);

    const result = await deleteNoteAction(note.id);

    setIsLoading(false);
    setShowDeleteConfirm(false);

    if (result.success) {
      queue.add({ title: "Note deleted" }, { timeout: 5000 });
      onOpenChange(false);
      onSuccess();
    } else {
      queue.add({ title: result.error ?? "Failed to delete note" }, { timeout: 5000 });
    }
  }

  const hasChanges = content.trim() !== note.content;
  const isValid = content.trim().length > 0;

  return (
    <>
      <Modal title="Edit Note" isOpen={isOpen} onOpenChange={onOpenChange} className={styles.modal}>
        <div className={styles.content}>
          <TextField
            isTextArea
            rows={5}
            value={content}
            onChange={setContent}
            placeholder="Enter note content..."
            isDisabled={isPending || isLoading}
          />
          <div className={styles.actions}>
            <Button
              variant="secondary"
              className={styles.deleteButton}
              onPress={() => setShowDeleteConfirm(true)}
              isDisabled={isPending || isLoading}
            >
              {isLoading ? <ProgressCircle aria-label="Deleting" /> : "Delete"}
            </Button>
            <Button
              onPress={handleSave}
              isDisabled={!isValid || !hasChanges || isPending || isLoading}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Note"
        confirmLabel="Delete"
        onConfirm={handleDelete}
      >
        Are you sure you want to delete this note? This action cannot be undone.
      </ConfirmDialog>
    </>
  );
}
