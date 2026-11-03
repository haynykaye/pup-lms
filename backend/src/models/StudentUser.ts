import { Account } from "./Account";

export class StudentUser extends Account {
  constructor(id: string, schoolId: string, name: string, email: string) {
    super(id, schoolId, name, email, "STUDENT");
  }
  getPermissions() {
    return ["course:view", "material:download", "announcement:view", "grade:view-own"];
  }
}