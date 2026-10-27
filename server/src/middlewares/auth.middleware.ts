import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthRequest = Request & {
  user?: {
    id: string;
    email: string;
    role: "STUDENT" | "MENTOR" | "ADMIN";
  };
};

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    if (
      typeof decoded.sub !== "string" ||
      typeof decoded.email !== "string" ||
      !["STUDENT", "MENTOR", "ADMIN"].includes(decoded.role)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const authorize = (
  ...roles: AuthRequest["user"] extends infer U
    ? U extends { role: infer R }
      ? R[]
      : never
    : never
) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as never)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};
