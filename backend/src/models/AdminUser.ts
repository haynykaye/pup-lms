import { Account } from "./Account";

export class AdminUser extends Account {
  constructor(id: string, schoolId: string, name: string, email: string) {
    super(id, schoolId, name, email, "ADMIN");
  }
  getPermissions() {
    return ["user:manage", "course:manage", "audit:view"];
  }
}