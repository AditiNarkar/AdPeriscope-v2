import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.workspace.upsert({
    where: { slug: "launch-lab" },
    update: {},
    create: {
      name: "Launch Lab",
      slug: "launch-lab",
      brandBrief: "AI marketing automation platform for startups, agencies, creators, and business teams."
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
