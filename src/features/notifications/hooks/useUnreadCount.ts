"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import { getUnreadNotificationCountAction } from "../actions";

export function useUnreadCount(
  initialCount: number,
): readonly [number, Dispatch<SetStateAction<number>>] {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const newCount = await getUnreadNotificationCountAction();
        if (!cancelled) setCount(newCount);
      } catch {
        // Swallow server-action errors during silent polling
      }
    }

    const intervalId = setInterval(() => {
      void poll();
    }, 30_000);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") void poll();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    function handleFocus() {
      void poll();
    }
    window.addEventListener("focus", handleFocus);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return [count, setCount] as const;
}
