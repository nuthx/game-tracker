import { getBasicPresence } from "psn-api"
import { getAuthorization } from "@/lib/auth"

export async function getPsnPresence(playerId) {
  const authorization = await getAuthorization()
  const basic = await getBasicPresence(authorization, playerId)

  const presence = {
    status: 500, // 0: 离线, 1: 在线, 2: 游戏中
    lastOnline: "",
    gameId: "",
    gameTitle: "",
    gamePlatform: "",
    gameIcon: ""
  }

  // 离线
  if (basic.basicPresence.availability === "unavailable") {
    presence.lastOnline = basic.basicPresence.primaryPlatformInfo.lastOnlineDate
  } else if (!basic.basicPresence.gameTitleInfoList) {
    presence.status = 1
    presence.lastOnline = basic.basicPresence.primaryPlatformInfo.lastOnlineDate
  } else {
    presence.status = 2
    presence.lastOnline = basic.basicPresence.primaryPlatformInfo.lastOnlineDate
    presence.gameId = basic.basicPresence.gameTitleInfoList[0].npTitleId
    presence.gameTitle = basic.basicPresence.gameTitleInfoList[0].titleName
    presence.gamePlatform = basic.basicPresence.gameTitleInfoList[0].launchPlatform.toUpperCase()
    presence.gameIcon = basic.basicPresence.gameTitleInfoList[0]?.conceptIconUrl || basic.basicPresence.gameTitleInfoList[0]?.npTitleIconUrl
  }

  return presence
}
