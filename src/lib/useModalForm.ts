"use client";

import { useState } from "react";
import type { ZodType } from "zod";

import { queue } from "@/components/ui/Toast/Toast";
import type { ActionStatusResponse } from "@/lib/action-response";

/** Configuration for {@link useModalForm}. */
interface UseModalFormOptions<TArgs> {
  /** Server Action invoked with the payload; omit to render a read-only form. */
  submit?: (args: TArgs) => Promise<ActionStatusResponse>;
  /** Called to close the modal (on success or cancel). */
  onOpenChange: (open: boolean) => void;
  /** Toast shown when the action succeeds. */
  successMessage: string;
  /** Toast shown when the action fails or is rejected by `schema`. */
  failureMessage: string;
  /** Optional callback run after a successful submission. */
  onSuccess?: () => void;
  /** Optional reset invoked on cancel and after a successful submission. */
  reset?: () => void;
  /** Optional Zod schema used to short-circuit submission with a toast on invalid input. */
  schema?: ZodType;
}

/** Return value of {@link useModalForm}. */
interface UseModalFormReturn<TArgs> {
  /** True while a submission is in flight. */
  isPending: boolean;
  /** Validates (when `schema` is set) then invokes `submit`, handling toasts and lifecycle. */
  submitForm: (args: TArgs) => Promise<void>;
  /** Closes the modal, resetting state unless a submission is pending. */
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
