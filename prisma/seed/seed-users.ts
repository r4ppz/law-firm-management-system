import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

interface SeedUser {
  name: string;
  email: string;
  role: Role;
  is_active?: boolean;
}

const activeUsers: SeedUser[] = [
  { name: "Dev Admin", email: "dev@aninolaw.com", role: Role.Dev },
  { name: "Atty. Maria Anino", email: "maria.anino@aninolaw.com", role: Role.Admin },
  { name: "Atty. James Reyes", email: "james.reyes@aninolaw.com", role: Role.Admin },
  { name: "Catherine Diaz", email: "catherine.diaz@aninolaw.com", role: Role.BranchManager },
  { name: "Robert Santos", email: "robert.santos@aninolaw.com", role: Role.BranchManager },
  { name: "Leonor Ramos", email: "leonor.ramos@aninolaw.com", role: Role.BranchManager },
  { name: "Atty. Miguel Cruz", email: "miguel.cruz@aninolaw.com", role: Role.Lawyer },
  { name: "Atty. Sofia Villanueva", email: "sofia.villanueva@aninolaw.com", role: Role.Lawyer },
  { name: "Atty. David Tan", email: "david.tan@aninolaw.com", role: Role.Lawyer },
  { name: "Atty. Angela Mercado", email: "angela.mercado@aninolaw.com", role: Role.Lawyer },
  { name: "Atty. Ricardo Guevarra", email: "ricardo.guevarra@aninolaw.com", role: Role.Lawyer },
  { name: "Atty. Gina Reyes", email: "gina.reyes@aninolaw.com", role: Role.Lawyer },
  { name: "Atty. Marco Lopez", email: "marco.lopez@aninolaw.com", role: Role.Lawyer },
  { name: "Jessica Lim", email: "jessica.lim@aninolaw.com", role: Role.Paralegal },
  { name: "Kevin Garcia", email: "kevin.garcia@aninolaw.com", role: Role.Paralegal },
  { name: "Nina Salvador", email: "nina.salvador@aninolaw.com", role: Role.Paralegal },
  { name: "Paolo Guerrero", email: "paolo.guerrero@aninolaw.com", role: Role.Paralegal },
  { name: "Maya Fernandez", email: "maya.fernandez@aninolaw.com", role: Role.Paralegal },
  { name: "Ramon Flores", email: "ramon.flores@aninolaw.com", role: Role.ProcessServer },
  { name: "Liza Mendoza", email: "liza.mendoza@aninolaw.com", role: Role.ProcessServer },
  { name: "Benito Cruz", email: "benito.cruz@aninolaw.com", role: Role.ProcessServer },
  { name: "Tina Roxas", email: "tina.roxas@aninolaw.com", role: Role.ProcessServer },
];

const inactiveUsers: SeedUser[] = [
  {
    name: "Paolo Santos",
    email: "paolo.santos@aninolaw.com",
    role: Role.Paralegal,
    is_active: false,
  },
  {
    name: "Atty. Wendy Chua",
    email: "wendy.chua@aninolaw.com",
    role: Role.Lawyer,
    is_active: false,
  },
  {
    name: "Rodel Francisco",
    email: "rodel.francisco@aninolaw.com",
    role: Role.ProcessServer,
    is_active: false,
  },
];

export async function seedUsers(): Promise<Record<string, string>> {
  const allUsers = [...activeUsers, ...inactiveUsers];
  const byEmail: Record<string, string> = {};

  for (const u of allUsers) {
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        role: u.role,
        is_active: u.is_active ?? true,
      },
    });
    byEmail[u.email] = user.id;
  }

  console.log(
    `Seeded ${allUsers.length} users (${activeUsers.length} active, ${inactiveUsers.length} inactive).`,
  );
  return byEmail;
}
