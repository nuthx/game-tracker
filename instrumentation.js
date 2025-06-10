export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initConfig } = await import("@/lib/prisma")
    const { initPlatform } = await import("@/lib/prisma")
    const { startTask } = await import("@/lib/schedule")
    await initConfig()
    await initPlatform()
    await startTask()
  }
}
