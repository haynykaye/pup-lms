import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { createAccount } from "../models/createAccount";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
  password: z.string().min(1, "Password is required."),
});

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    // Same message for both cases so attackers can't tell which emails exist
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    const account = createAccount(user);
    res.json({ token: account.signToken(), user: account, profile: account.toString() });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) return res.status(401).json({ error: "User no longer exists." });
    const account = createAccount(user);
    res.json({ user: account, permissions: account.getPermissions() });
  } catch (err) {
    next(err);
  }
}