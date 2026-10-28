import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

type TokenUser = {
  id: string;
  email: string;
  role: "STUDENT" | "MENTOR" | "ADMIN";
};

export const hashPassword = async (password: string): Promise<string> =>
  bcrypt.hash(password, 12);

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => bcrypt.compare(password, hashedPassword);

export const createToken = (user: TokenUser): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
    expiresIn: "1d",
  });
};
