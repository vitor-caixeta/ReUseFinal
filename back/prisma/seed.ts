import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo123A!", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@reuse.com" },
    update: {},
    create: { name: "Demo", email: "demo@reuse.com", password: passwordHash },
  });

  await prisma.item.createMany({
    data: [
      { title: "Livro de Java", description: "Novo", type: "doacao", userId: user.id },
      { title: "Teclado mecânico", description: "Cherry MX", type: "troca", userId: user.id },
    ],
    skipDuplicates: true,
  });

  console.log("Seed OK:", { user: { id: user.id, email: user.email } });
}

main().finally(() => prisma.$disconnect());