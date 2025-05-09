export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initUser } = await import("@/lib/prisma")
    const { startTask } = await import("@/lib/schedule")
    await initUser()
    await startTask()
  }
}
