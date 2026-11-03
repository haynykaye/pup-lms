import { Account } from "./Account";
import { FacultyUser } from "./FacultyUser";
import { StudentUser } from "./StudentUser";
import { AdminUser } from "./AdminUser";

interface UserRow {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
}

export function createAccount(u: UserRow): Account {
  switch (u.role) {
    case "FACULTY": return new FacultyUser(u.id, u.schoolId, u.name, u.email);
    case "ADMIN": return new AdminUser(u.id, u.schoolId, u.name, u.email);
    default: return new StudentUser(u.id, u.schoolId, u.name, u.email);
  }
}