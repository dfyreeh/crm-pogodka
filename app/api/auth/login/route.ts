import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/lib/fingerprint";

const JWT_SECRET = process.env.JWT_SECRET || "секрет";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  //  Шукаємо користувача
  const user = await prisma.securityAdmin.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json(
      { error: "Користувач не знайдений" },
      { status: 404 },
    );

  // Хішемо введений пароль і порівнюємо зі сховищем
  const hashed = hashPassword(password);
  if (hashed !== user.password) {
    return NextResponse.json({ error: "Невірний пароль" }, { status: 401 });
  }

  // Генеруєм JWT
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return NextResponse.json({ token, email: user.email, role: user.role });
}
