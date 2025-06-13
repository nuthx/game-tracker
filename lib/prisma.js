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

export const defaultPlatforms = [
  { name: "PS4", color: "#003791" },
  { name: "PS5", color: "#003791" },
  { name: "Switch", color: "#E60012" },
  { name: "PC", color: "#0078D6" },
  { name: "macOS", color: "#555555" }
]
