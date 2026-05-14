import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@adperiscope.local" },
    update: {},
    create: {
      email: "demo@adperiscope.local",
      name: "Demo User"
    }
  });

  await prisma.workspace.upsert({
    where: { slug: "launch-lab" },
    update: {
      userId: user.id
    },
    create: {
      name: "Launch Lab",
      slug: "launch-lab",
      brandBrief: "AI marketing automation platform for startups, agencies, creators, and businesses.",
      userId: user.id
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
