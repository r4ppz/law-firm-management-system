"use client";

import { useState } from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";
import { logoutUser } from "@/features/auth/actions";

import styles from "./SignOutButton.module.css";

export function SignOutButton() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" aria-label="Sign out" onPress={() => setOpen(true)}>
        <FaArrowRightFromBracket className={styles.icon} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={setOpen} title="Sign Out" role="alertdialog">
        <p className={styles.message}>Are you sure you want to sign out?</p>
        <form action={logoutUser} className={styles.actions}>
          <Button type="button" variant="secondary" onPress={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Sign Out
          </Button>
        </form>
      </Modal>
    </>
  );
}
