import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token)
    return NextResponse.json({ error: "Не має токіна" }, { status: 401 });

  const user = verifyToken(token);
  if (!user)
    return NextResponse.json({ error: "Невірний токен" }, { status: 401 });

  return NextResponse.json({ message: "Доступ дозволено", user });
}
