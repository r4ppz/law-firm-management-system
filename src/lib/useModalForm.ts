"use client";

import { useState } from "react";

import { queue } from "@/components/ui/Toast/Toast";
import type { ActionStatusResponse } from "@/lib/action-response";

interface UseModalFormOptions<TArgs> {
  submit: (args: TArgs) => Promise<ActionStatusResponse>;
  onOpenChange: (open: boolean) => void;
  successMessage: string;
  failureMessage: string;
  onSuccess?: () => void;
  reset?: () => void;
}

interface UseModalFormReturn<TArgs> {
  isPending: boolean;
  submitForm: (args: TArgs) => Promise<void>;
  handleCancel: () => void;
}

export function useModalForm<TArgs>({
  submit,
  onOpenChange,
  successMessage,
  failureMessage,
  onSuccess,
  reset,
}: UseModalFormOptions<TArgs>): UseModalFormReturn<TArgs> {
  const [isPending, setIsPending] = useState(false);

  async function submitForm(args: TArgs) {
    setIsPending(true);

    try {
      const result = await submit(args);

      if (result.success) {
        queue.add({ title: successMessage }, { timeout: 5000 });
        reset?.();
        onOpenChange(false);
        onSuccess?.();
      } else {
        queue.add({ title: result.error ?? failureMessage }, { timeout: 5000 });
      }
    } catch {
      queue.add({ title: failureMessage }, { timeout: 5000 });
    } finally {
      setIsPending(false);
    }
  }

  function handleCancel() {
    if (isPending) return;
    reset?.();
    onOpenChange(false);
  }

  return { isPending, submitForm, handleCancel };
}
