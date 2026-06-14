"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { FieldError, Form } from "@/components/ui/Form/Form";
import { Modal } from "@/components/ui/Modal/Modal";
import { Select, SelectItem } from "@/components/ui/Select/Select";
import { TextField } from "@/components/ui/TextField/TextField";
import { createUserAction } from "@/features/users/actions";
import { CREATABLE_ROLES, roleLabels } from "@/features/users/constants";

import styles from "./AddUserModal.module.css";

interface AddUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

export function AddUserModal({ isOpen, onOpenChange, onSuccess }: AddUserModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    if (!email || !role) {
      setError("All fields are required.");
      setIsPending(false);
      return;
    }

    const result = await createUserAction(email, role);
    if (result.error) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    onSuccess?.();
    onOpenChange(false);
  }

  return (
    <Modal className={styles.modal} title="Add User" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form action={handleSubmit} className={styles.form}>
        <TextField
          label="Email"
          name="email"
          type="email"
          isRequired
          placeholder="user@example.com"
          className={styles.field}
        />

        <Select label="Role" name="role" isRequired className={styles.field}>
          {CREATABLE_ROLES.map((role) => (
            <SelectItem id={role} key={role}>
              {roleLabels[role]}
            </SelectItem>
          ))}
        </Select>

        {error && <FieldError className={styles.formError}>{error}</FieldError>}

        <div className={styles.buttons}>
          <Button type="button" variant="primary" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary" isPending={isPending}>
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
