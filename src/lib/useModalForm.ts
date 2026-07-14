"use client";

import { useState } from "react";
import type { ZodType } from "zod";

import { queue } from "@/components/ui/Toast/Toast";
import type { ActionStatusResponse } from "@/lib/action-response";

interface UseModalFormOptions<TArgs> {
  submit?: (args: TArgs) => Promise<ActionStatusResponse>;
  onOpenChange: (open: boolean) => void;
  successMessage: string;
  failureMessage: string;
  onSuccess?: () => void;
  reset?: () => void;
  schema?: ZodType;
}

interface UseModalFormReturn<TArgs> {
  isPending: boolean;
  submitForm: (args: TArgs) => Promise<void>;
  handleCancel: () => void;
}

/**
 * Shared form-submission lifecycle for modals.
 *
 * Callers must provide the `TArgs` generic explicitly (e.g.
 * `useModalForm<z.input<typeof SomeSchema>>`) because `submit` cannot infer it
 * from the payload — omitting it widens `submitForm` arguments to `unknown`.
 */
export function useModalForm<TArgs>({
  submit,
  onOpenChange,
  successMessage,
  failureMessage,
  onSuccess,
  reset,
  schema,
}: UseModalFormOptions<TArgs>): UseModalFormReturn<TArgs> {
  const [isPending, setIsPending] = useState(false);

  async function submitForm(args: TArgs) {
    if (!submit) return;

    if (schema && !schema.safeParse(args).success) {
      queue.add({ title: failureMessage }, { timeout: 5000 });
      return;
    }

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
    } catch (error) {
      console.error("useModalForm: submit failed", error);
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
