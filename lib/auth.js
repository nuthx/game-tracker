import { exchangeNpssoForAccessCode, exchangeAccessCodeForAuthTokens } from "psn-api";

export async function getAuthorization() {
  const myNpsso = process.env.PSN_NPSSO;
  if (!myNpsso) {
    throw new Error("PSN NPSSO token not found");
  }
  const accessCode = await exchangeNpssoForAccessCode(myNpsso);
  const authorization = await exchangeAccessCodeForAuthTokens(accessCode);
  return authorization;
}
