"use client";

import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { DateField } from "@/components/ui/DateField/DateField";
import { Modal } from "@/components/ui/Modal/Modal";
import { Select, SelectItem } from "@/components/ui/Select/Select";
import { TextField } from "@/components/ui/TextField/TextField";
import { queue } from "@/components/ui/Toast/Toast";
import { createMilestoneAction } from "@/features/milestones/actions";
import { CaseMilestoneStatus } from "@/generated/prisma/browser";

import styles from "./AddMilestoneModal.module.css";

const STATUS_OPTIONS = Object.values(CaseMilestoneStatus);

interface AddMilestoneModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  caseId: string;
}

export function AddMilestoneModal({
  isOpen,
  onOpenChange,
  onSuccess,
  caseId,
}: AddMilestoneModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<CalendarDate>(today(getLocalTimeZone()));
  const [status, setStatus] = useState<string>(CaseMilestoneStatus.Pending);
  const [isPending, setIsPending] = useState(false);

  function handleCancel() {
    if (isPending) return;
    setTitle("");
    setDescription("");
    setDueDate(today(getLocalTimeZone()));
    setStatus(CaseMilestoneStatus.Pending);
    onOpenChange(false);
  }

  async function handleSubmit() {
    if (!title.trim()) return;
    setIsPending(true);

    const date = dueDate.toDate(getLocalTimeZone());

    const result = await createMilestoneAction({
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: date,
      status,
      case_id: caseId,
    });

    setIsPending(false);

    if (result.success) {
      queue.add({ title: "Milestone added" }, { timeout: 5000 });
      setTitle("");
      setDescription("");
      setDueDate(today(getLocalTimeZone()));
      setStatus(CaseMilestoneStatus.Pending);
      onOpenChange(false);
      onSuccess();
    } else {
      queue.add({ title: result.error ?? "Failed to add milestone" }, { timeout: 5000 });
    }
  }

  return (
    <Modal
      title="Add Milestone"
      isOpen={isOpen}
      onOpenChange={handleCancel}
      className={styles.modal}
    >
      <div className={styles.content}>
        <TextField
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="Milestone title"
          isDisabled={isPending}
        />
        <TextField
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Optional description"
          isTextArea
          rows={3}
          isDisabled={isPending}
        />
        <DateField
          label="Due Date"
          value={dueDate}
          onChange={(v) => v && setDueDate(v)}
          isDisabled={isPending}
        />
        <Select label="Status" value={status} onChange={(k) => setStatus(String(k))}>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s} id={s}>
              {s}
            </SelectItem>
          ))}
        </Select>
        <div className={styles.actions}>
          <Button variant="secondary" onPress={handleCancel} isDisabled={isPending}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} isDisabled={!title.trim() || isPending}>
            {isPending ? "Saving..." : "Save Milestone"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
