import { PrismaClient } from "@prisma/client"

const globalForPrisma = global

// Add type declaration for global prisma instance
const prismaInstance = new PrismaClient({
  log: ["error", "warn"]
})

// Simplify the global instance handling
if (process.env.NODE_ENV !== "production") {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prismaInstance
  }
}

export const prisma = prismaInstance

export async function initConfig() {
  await prisma.config.upsert({
    where: { id: 1 },
    update: {},
    create: {
      username: "admin",
      password: "admin"
    }
  })
}

export async function initPlatform() {
  const platforms = [
    {
      id: 1,
      fullName: "PlayStation 4",
      shortName: "PS4",
      type: "psn"
    },
    {
      id: 2,
      fullName: "PlayStation 5",
      shortName: "PS5",
      type: "psn"
    },
    {
      id: 3,
      fullName: "Nintendo Switch",
      shortName: "NS",
      type: "ns"
    },
    {
      id: 4,
      fullName: "Nintendo Switch 2",
      shortName: "NS2",
      type: "ns"
    },
    {
      id: 5,
      fullName: "Microsoft Windows",
      shortName: "Windows",
      type: "pc"
    },
    {
      id: 6,
      fullName: "macOS",
      shortName: "macOS",
      type: "pc"
    }
  ]

  await Promise.all(
    platforms.map((platform) =>
      prisma.platform.upsert({
        where: { id: platform.id },
        update: {},
        create: platform
      })
    )
  )
}
