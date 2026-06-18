"use client";

import clsx from "clsx";
import {
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";

import styles from "./Popover.module.css";

export interface PopoverProps extends Omit<AriaPopoverProps, "className"> {
  className?: string;
  children: React.ReactNode;
}

export function Popover({ children, className, ...props }: PopoverProps) {
  return (
    <AriaPopover className={clsx(styles.popover, className)} {...props}>
      {children}
    </AriaPopover>
  );
}
