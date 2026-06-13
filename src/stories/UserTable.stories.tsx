import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { UserTable, type UserRow } from "@/features/users/components/UserTable";
import type { Role } from "@/generated/prisma/client";

const mockUsers: UserRow[] = [
  {
    id: "1",
    name: "Alice Williams",
    email: "alice@example.com",
    role: "Admin" as Role,
    is_active: true,
    created_at: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Lawyer" as Role,
    is_active: true,
    created_at: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "Carol Martinez",
    email: "carol@example.com",
    role: "Paralegal" as Role,
    is_active: true,
    created_at: new Date("2024-03-10"),
  },
  {
    id: "4",
    name: "David Chen",
    email: "david@example.com",
    role: "BranchManager" as Role,
    is_active: false,
    created_at: new Date("2024-04-05"),
  },
  {
    id: "5",
    name: "Eve Davis",
    email: "eve@example.com",
    role: "ProcessServer" as Role,
    is_active: true,
    created_at: new Date("2024-05-12"),
  },
  {
    id: "6",
    name: "Frank Miller",
    email: "frank@example.com",
    role: null,
    is_active: true,
    created_at: new Date("2024-06-01"),
  },
];

const meta: Meta<typeof UserTable> = {
  component: UserTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UserTable>;

export const Default: Story = {
  args: {
    users: mockUsers,
  },
};

export const WithFill: Story = {
  args: {
    users: mockUsers,
    fill: true,
  },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", flexDirection: "column", height: 400 }}>
        <Story />
      </div>
    ),
  ],
};
