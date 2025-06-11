import { exchangeNpssoForAccessCode, exchangeAccessCodeForAuthTokens } from "psn-api"
import { prisma } from "@/lib/prisma"

export async function getAuthorization(npsso = null) {
  if (!npsso) {
    const config = await prisma.config.findUnique({ where: { id: 1 } })
    if (!config.psnNpsso) {
      throw new Error("PSN NPSSO token not found")
    }
    npsso = config.psnNpsso
  }
  const accessCode = await exchangeNpssoForAccessCode(npsso)
  const authorization = await exchangeAccessCodeForAuthTokens(accessCode)
  return authorization
}
