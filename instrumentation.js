export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initUser } = await import("@/lib/prisma")
    const { startTask } = await import("@/lib/schedule")
    const { closeErrorRecord } = await import("@/lib/check")
    await initUser();
    await startTask();
    await closeErrorRecord();
  }
}
