import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// функция для генерации slug из nameUa
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export async function GET(req: NextRequest) {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json(
      { error: "Помилка при отриманні міст" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // простая валидация
    const requiredFields = [
      "nameUa",
      "nameRu",
      "nameEn",
      "region",
      "countryUa",
      "countryEn",
      "latitude",
      "longitude",
    ];
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          { error: `Поле ${field} обов'язкове` },
          { status: 400 },
        );
      }
    }

    // генерируем slug, если не передан
    if (!data.slug) {
      data.slug = generateSlug(data.nameUa);
    }

    const city = await prisma.city.create({
      data: {
        nameUa: data.nameUa,
        nameRu: data.nameRu,
        nameEn: data.nameEn,
        region: data.region,
        countryUa: data.countryUa,
        countryEn: data.countryEn,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        slug: data.slug,
      },
    });

    return NextResponse.json(city);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Помилка при додаванні міста" },
      { status: 500 },
    );
  }
}
