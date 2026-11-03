import { Request, Response, NextFunction } from "express";
import { Account, RoleName, TokenPayload } from "../models/Account";

declare global {
  namespace Express {
    interface Request { user?: TokenPayload }
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed token." });
  }
  try {
    req.user = Account.verifyToken(header.split(" ")[1]);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token. Please log in again." });
  }
}

export function requireRole(...roles: RoleName[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to do this." });
    }
    next();
  };
}