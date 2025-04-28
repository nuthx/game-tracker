import { getBasicPresence } from "psn-api";
import { getAuthorization } from "@/lib/auth";

export async function checkPresence() {
  try {
    const authorization = await getAuthorization();
    const presence = await getBasicPresence(authorization, "me");

    if (presence.basicPresence.availability === "unavailable") {
      console.log("用户不在线");
      return;
    } else {
      console.log(presence.gameTitleInfoList[0].titleName);
    }
  } catch (error) {
    console.error(error);
  }
}
