import "dotenv/config";
import { hashPassword } from "@/lib/fingerprint";
import prisma from "../lib/prisma";

async function main() {
  const email = "admin@pogodka.com";
  const password = "N7@pQkR9#mL2$x4&wT6!vZ8";

  const hashed = hashPassword(password);

  const user = await prisma.securityAdmin.create({
    data: {
      email,
      password: hashed,
      role: "admin",
    },
  });

  console.log("Админ создан:", user.email);
}

main().finally(() => prisma.$disconnect());
