import { PrismaClient } from "@prisma/client"

const globalForPrisma = global;

// Add type declaration for global prisma instance
const prismaInstance = new PrismaClient({
  log: ["error", "warn"]
});

// Simplify the global instance handling
if (process.env.NODE_ENV !== "production") {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;

export async function initUser() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "admin",
      psnId: "me"
    },
  });
}
