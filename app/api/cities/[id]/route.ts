import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const cityId = Number(id);

    if (isNaN(cityId)) {
      return NextResponse.json({ message: "Невірний ID" }, { status: 400 });
    }

    await prisma.city.delete({ where: { id: cityId } });

    return NextResponse.json({ message: "Місто видалено" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Помилка при видаленні міста" },
      { status: 500 },
    );
  }
}
