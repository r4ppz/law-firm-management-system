"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { Modal } from "@/components/ui/Modal/Modal";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import { Select, SelectItem } from "@/components/ui/Select/Select";
import { TextField } from "@/components/ui/TextField/TextField";
import { queue } from "@/components/ui/Toast/Toast";
import {
  deleteTaskAction,
  getActiveUsersAction,
  getTaskDetailRowByIdAction,
  updateTaskAction,
} from "@/features/tasks/actions";
import type { TaskDetailRow } from "@/features/tasks/queries";
import { TaskStatus } from "@/generated/prisma/browser";

import styles from "./EditTaskModal.module.css";

const STATUS_OPTIONS = Object.values(TaskStatus);

interface EditTaskModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  taskId: string | null;
}

export function EditTaskModal({ isOpen, onOpenChange, onSuccess, taskId }: EditTaskModalProps) {
  const [task, setTask] = useState<TaskDetailRow | null>(null);
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>(TaskStatus.Pending);
  const [assigneeIds, setAssigneeIds] = useState<Set<string>>(new Set());

  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen || !taskId) return;

    let cancelled = false;

    void Promise.all([getTaskDetailRowByIdAction(taskId), getActiveUsersAction()]).then(
      ([taskData, usersData]) => {
        if (cancelled) return;
        if (taskData) {
          setTask(taskData);
          setTitle(taskData.title);
          setDescription(taskData.description ?? "");
          setStatus(taskData.status);
          setAssigneeIds(new Set(taskData.assignee_ids));
        } else {
          setTask(null);
        }
        setUsers(usersData);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [isOpen, taskId]);

  async function handleSave() {
    if (!title.trim() || !taskId) return;
    setIsPending(true);

    const result = await updateTaskAction({
      taskId,
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      assignee_ids: Array.from(assigneeIds),
    });

    setIsPending(false);

    if (result.success) {
      queue.add({ title: "Task updated" }, { timeout: 5000 });
      onOpenChange(false);
      onSuccess();
    } else {
      queue.add({ title: result.error ?? "Failed to update task" }, { timeout: 5000 });
    }
  }

  async function handleDelete() {
    if (!taskId) return;
    setIsDeleting(true);

    const result = await deleteTaskAction(taskId);

    setIsDeleting(false);
    setShowDeleteConfirm(false);

    if (result.success) {
      queue.add({ title: "Task deleted" }, { timeout: 5000 });
      onOpenChange(false);
      onSuccess();
    } else {
      queue.add({ title: result.error ?? "Failed to delete task" }, { timeout: 5000 });
    }
  }

  const isLoadingData = isOpen && task == null;
  const hasChanges =
    title.trim() !== (task?.title ?? "") ||
    description.trim() !== (task?.description ?? "") ||
    status !== (task?.status ?? "Pending") ||
    !areSetsEqual(assigneeIds, new Set(task?.assignee_ids ?? []));

  const isValid = title.trim().length > 0;

  if (isLoadingData) {
    return (
      <Modal title="Edit Task" isOpen={isOpen} onOpenChange={onOpenChange} className={styles.modal}>
        <div className={styles.loadingContainer}>
          <ProgressCircle aria-label="Loading task" />
        </div>
      </Modal>
    );
  }

  if (!task) {
    return (
      <Modal title="Edit Task" isOpen={isOpen} onOpenChange={onOpenChange} className={styles.modal}>
        <div className={styles.loadingContainer}>
          <span>Task not found.</span>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal title="Edit Task" isOpen={isOpen} onOpenChange={onOpenChange} className={styles.modal}>
        <div className={styles.content}>
          <TextField
            label="Title"
            value={title}
            onChange={setTitle}
            placeholder="Enter task title..."
            isDisabled={isPending || isDeleting}
          />
          <TextField
            label="Description"
            isTextArea
            rows={3}
            value={description}
            onChange={setDescription}
            placeholder="Optional description..."
            isDisabled={isPending || isDeleting}
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
            isDisabled={isPending || isDeleting}
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
            <Button
              variant="secondary"
              onPress={handleSave}
              isDisabled={!isValid || !hasChanges || isPending || isDeleting}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
            <Button onPress={() => setShowDeleteConfirm(true)} isDisabled={isPending || isDeleting}>
              {isDeleting ? <ProgressCircle aria-label="Deleting" /> : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Task"
        confirmLabel="Delete"
        onConfirm={handleDelete}
      >
        Are you sure you want to delete this task? This action cannot be undone.
      </ConfirmDialog>
    </>
  );
}

function areSetsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}
