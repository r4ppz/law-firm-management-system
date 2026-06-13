"use client";

import clsx from "clsx";
import NextLink from "next/link";
import { Link as RACLink, type LinkProps as RACLinkProps } from "react-aria-components";

import styles from "./Link.module.css";

export function Link({ className, ...props }: RACLinkProps) {
  return (
    <RACLink
      {...props}
      className={clsx(styles.link, className)}
      render={(domProps) => {
        if ("href" in domProps) {
          return <NextLink {...domProps} />;
        }
        return <span {...domProps} />;
      }}
    />
  );
}
