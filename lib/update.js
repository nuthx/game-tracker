import { prisma } from "@/lib/prisma";
import { getAuthorization } from "@/lib/auth";
import { getProfileFromUserName } from "psn-api";

export async function updateNpsso(npsso) {
  const authorization = await getAuthorization(npsso);
  const data = await getProfileFromUserName(authorization, "me");
  await prisma.user.update({
    where: { id: 1 },
    data: {
      onlineId: data.profile.onlineId,
      accountId: data.profile.accountId,
      avatar: data.profile.avatarUrls[0].avatarUrl,
    },
  });
  return data
}
