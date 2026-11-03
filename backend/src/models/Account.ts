import jwt from "jsonwebtoken";

export type RoleName = "STUDENT" | "FACULTY" | "ADMIN";
export interface TokenPayload {
  sub: string;
  role: RoleName;
}

export abstract class Account {
  protected constructor(
    protected readonly id: string,
    protected readonly schoolId: string,
    protected readonly name: string,
    protected readonly email: string,
    protected readonly role: RoleName
  ) {}

  abstract getPermissions(): string[];

  getId() { return this.id; }
  getRole() { return this.role; }

  // Polymorphism: overriding toString
  toString() {
    return `Name: ${this.name} | ID: ${this.schoolId} | Role: ${this.role}`;
  }

  // Safe serialization: never exposes passwordHash
  toJSON() {
    return { id: this.id, schoolId: this.schoolId, name: this.name, email: this.email, role: this.role };
  }

  signToken(): string {
    const payload: TokenPayload = { sub: this.id, role: this.role };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "8h" });
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, process.env.JWT_SECRET as string) as unknown as TokenPayload;
  }
}