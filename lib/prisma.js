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
    { id: 1, name: "PlayStation 4", slug: "PS4", color: "#003791" },
    { id: 2, name: "PlayStation 5", slug: "PS5", color: "#003791" },
    { id: 3, name: "Nintendo Switch", slug: "Switch", color: "#E60012" },
    { id: 4, name: "Nintendo Switch 2", slug: "Switch 2", color: "#E60012" },
    { id: 5, name: "Xbox One", slug: "Xbox One", color: "#107C10" },
    { id: 6, name: "Xbox Series X", slug: "Series X", color: "#107C10" },
    { id: 7, name: "Microsoft Windows", slug: "PC", color: "#0078D6" },
    { id: 8, name: "macOS", slug: "macOS", color: "#555555" }
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
