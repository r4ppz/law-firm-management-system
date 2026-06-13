import { UserTable } from "@/features/users/components/UserTable";
import { getUsers } from "@/features/users/queries";

import styles from "./page.module.css";

export default async function UserPage() {
  const users = await getUsers();

  return (
    <div className={styles.wrapper}>
      <UserTable users={users} fill />
    </div>
  );
}
