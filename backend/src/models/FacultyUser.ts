import { Account } from "./Account";

export class FacultyUser extends Account {
  constructor(id: string, schoolId: string, name: string, email: string) {
    super(id, schoolId, name, email, "FACULTY");
  }
  getPermissions() {
    return ["course:create", "material:upload", "material:hide", "announcement:publish", "grade:submit"];
  }
}