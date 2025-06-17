import { exchangeNpssoForAccessCode, exchangeAccessCodeForAuthTokens, getBasicPresence } from "psn-api"

export async function getPsnPresence(config) {
  const presence = {
    status: 401, // 0: 离线, 1: 在线, 2: 游戏中, 401: 未登录
    lastOnline: "",
    gameId: "",
    gameTitle: "",
    gamePlatform: "",
    gameIcon: ""
  }

  // 检查是否已登录
  if (!config.psnNpsso) {
    return presence
  }

  // 获取用户信息
  const accessCode = await exchangeNpssoForAccessCode(config.psnNpsso)
  const authorization = await exchangeAccessCodeForAuthTokens(accessCode)
  const basic = await getBasicPresence(authorization, config.psnMonitorFromId)

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
