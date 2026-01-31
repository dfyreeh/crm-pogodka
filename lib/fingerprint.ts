import crypto from "crypto";

if (!process.env.PASSWORD_SECRET) {
  throw new Error("PASSWORD_SECRET не заданий");
}

const SECRET: string = process.env.PASSWORD_SECRET;

export function hashPassword(password: string): string {
  return crypto.createHmac("sha256", SECRET).update(password).digest("hex");
}
