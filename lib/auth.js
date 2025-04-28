import { exchangeNpssoForAccessCode, exchangeAccessCodeForAuthTokens } from "psn-api";
import { prisma } from "@/lib/prisma";

export async function getAuthorization() {
  const user = await prisma.user.findUnique({ where: { id: 1 } });
  if (!user.npsso) {
    throw new Error("PSN NPSSO token not found");
  }
  const accessCode = await exchangeNpssoForAccessCode(user.npsso);
  const authorization = await exchangeAccessCodeForAuthTokens(accessCode);
  return authorization;
}
