export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initUser } = await import("@/lib/prisma")
    await initUser();
  }
}
