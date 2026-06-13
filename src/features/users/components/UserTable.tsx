"use client";

import { useMemo, useState } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { SearchField } from "@/components/ui/SearchField/SearchField";
import type { Role } from "@/generated/prisma/client";

import styles from "./UserTable.module.css";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role | null;
  is_active: boolean;
  created_at: Date;
}

interface UserTableProps {
  users: UserRow[];
  fill?: boolean;
}

const roleLabels: Record<string, string> = {
  Dev: "Dev",
  Admin: "Admin",
  BranchManager: "Branch Manager",
  Lawyer: "Lawyer",
  Paralegal: "Paralegal",
  ProcessServer: "Process Server",
};

const roleColors: Record<string, string> = {
  Dev: "var(--color-text-muted)",
  Admin: "var(--color-info)",
  BranchManager: "var(--color-info)",
  Lawyer: "var(--color-success)",
  Paralegal: "var(--color-warning)",
  ProcessServer: "var(--color-warning)",
};

const columns: ColumnDef<UserRow>[] = [
  {
    id: "name",
    name: "Name",
    isRowHeader: true,
    allowsSorting: true,
  },
  {
    id: "email",
    name: "Email",
    allowsSorting: true,
  },
  {
    id: "role",
    name: "Role",
    allowsSorting: true,
    render: (value) => {
      const role = value as Role | null;
      if (!role) return null;
      return (
        <span
          className={styles.roleBadge}
          style={{ color: roleColors[role] ?? "var(--color-text-primary)" }}
        >
          {roleLabels[role] ?? role}
        </span>
      );
    },
  },
  {
    id: "is_active",
    name: "Action",
    render: () => (
      <div className={styles.actions}>
        <Button variant="ghost" aria-label="Edit user">
          <FaPenToSquare />
        </Button>
        <Button variant="ghost" aria-label="Delete user">
          <FaTrashCan />
        </Button>
      </div>
    ),
  },
];

export function UserTable({ users, fill }: UserTableProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search users..."
            aria-label="Search users"
          />
        </div>
        <Button variant="primary" className={styles.addButton} aria-label="Add user">
          <FaPlus /> Add User
        </Button>
      </div>
      <DataTable columns={columns} rows={filtered} fill={fill} />
    </div>
  );
}
