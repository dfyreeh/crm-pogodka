import crypto from "crypto";

if (!process.env.PASSWORD_SECRET) {
  throw new Error("PASSWORD_SECRET не заданий");
}

const SECRET: string = process.env.PASSWORD_SECRET;

export function hashPassword(password: string): string {
  return crypto.createHmac("sha256", SECRET).update(password).digest("hex");
}

/**
 * Генерация уникального fingerprint для аналитики
 * @param ip IP пользователя
 * @param userAgent User-Agent браузера
 */
export function fingerprint(ip: string, userAgent: string): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(ip + "|" + userAgent)
    .digest("hex");
}
