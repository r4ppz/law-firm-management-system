"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";
import { Select, SelectItem } from "@/components/ui/Select/Select";
import { TextField } from "@/components/ui/TextField/TextField";
import { queue } from "@/components/ui/Toast/Toast";
import { createTaskAction, getActiveUsersAction } from "@/features/tasks/actions";
import { TaskStatus } from "@/generated/prisma/browser";

import styles from "./AddTaskModal.module.css";

const STATUS_OPTIONS = Object.values(TaskStatus);

interface AddTaskModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  caseId: string;
}

export function AddTaskModal({ isOpen, onOpenChange, onSuccess, caseId }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>(TaskStatus.Pending);
  const [assigneeIds, setAssigneeIds] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    getActiveUsersAction().then(setUsers);
  }, [isOpen]);

  function handleCancel() {
    if (isPending) return;
    setTitle("");
    setDescription("");
    setStatus(TaskStatus.Pending);
    setAssigneeIds(new Set());
    onOpenChange(false);
  }

  async function handleSubmit() {
    if (!title.trim()) return;
    setIsPending(true);

    const result = await createTaskAction({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      case_id: caseId,
      assignee_ids: Array.from(assigneeIds),
    });

    setIsPending(false);

    if (result.success) {
      queue.add({ title: "Task created" }, { timeout: 5000 });
      setTitle("");
      setDescription("");
      setStatus(TaskStatus.Pending);
      setAssigneeIds(new Set());
      onOpenChange(false);
      onSuccess();
    } else {
      queue.add({ title: result.error ?? "Failed to create task" }, { timeout: 5000 });
    }
  }

  return (
    <Modal title="Add Task" isOpen={isOpen} onOpenChange={handleCancel} className={styles.modal}>
      <div className={styles.content}>
        <TextField
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="Enter task title..."
          isDisabled={isPending}
        />
        <TextField
          label="Description"
          isTextArea
          rows={3}
          value={description}
          onChange={setDescription}
          placeholder="Optional description..."
          isDisabled={isPending}
        />
        <Select label="Status" value={status} onChange={(k) => setStatus(String(k))}>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s} id={s}>
              {s}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Assignees"
          selectionMode="multiple"
          value={Array.from(assigneeIds)}
          onChange={(keys) => setAssigneeIds(new Set(keys.map(String)))}
          placeholder="Select assignees..."
          items={users}
          isDisabled={isPending}
        >
          {(user) => <SelectItem id={user.id}>{user.name}</SelectItem>}
        </Select>
        {assigneeIds.size > 0 && (
          <ul className={styles.selectedAssignees}>
            {users
              .filter((u) => assigneeIds.has(u.id))
              .map((u) => (
                <li key={u.id} className={styles.selectedAssignee}>
                  {u.name}
                </li>
              ))}
          </ul>
        )}
        <div className={styles.actions}>
          <Button variant="secondary" onPress={handleCancel} isDisabled={isPending}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} isDisabled={!title.trim() || isPending}>
            {isPending ? "Saving..." : "Save Task"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
