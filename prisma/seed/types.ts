export interface SeedContext {
  userByEmail: Record<string, string>;
  clients: { id: string; email: string }[];
  consultations: { id: string; status: string }[];
  cases: { id: string; title: string }[];
  tasks: { id: string; title: string }[];
}
