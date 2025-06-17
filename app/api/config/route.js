import { prisma } from "@/lib/prisma"
import { startTask } from "@/lib/schedule"
import { sendResponse } from "@/lib/http/response"
import { exchangeNpssoForAccessCode, exchangeAccessCodeForAuthTokens, getProfileFromUserName, getProfileFromAccountId } from "psn-api"

export async function GET(request) {
  try {
    const config = await prisma.config.findUnique({ where: { id: 1 } })
    return sendResponse(request, {
      data: {
        username: config.username,
        psnNpsso: config.psnNpsso ? `${config.psnNpsso.slice(0, 4)}****${config.psnNpsso.slice(-4)}` : "",
        psnMonitorFromId: config.psnMonitorFromId,
        psnMonitorFromName: config.psnMonitorFromName,
        psnMonitorFromAvatar: config.psnMonitorFromAvatar,
        psnMonitorToId: config.psnMonitorToId,
        psnMonitorToName: config.psnMonitorToName,
        psnMonitorToAvatar: config.psnMonitorToAvatar,
        psnMonitorInterval: config.psnMonitorInterval
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}

export async function PATCH(request) {
  try {
    const data = await request.json()

    if (data.psnNpsso) {
      const accessCode = await exchangeNpssoForAccessCode(data.psnNpsso)
      const authorization = await exchangeAccessCodeForAuthTokens(accessCode)
      const profile = await getProfileFromUserName(authorization, "me")
      await prisma.config.update({
        where: { id: 1 },
        data: {
          psnNpsso: data.psnNpsso,
          psnMonitorFromId: profile.profile.accountId,
          psnMonitorFromName: profile.profile.onlineId,
          psnMonitorFromAvatar: profile.profile.avatarUrls[0].avatarUrl,
          psnMonitorToId: profile.profile.accountId,
          psnMonitorToName: profile.profile.onlineId,
          psnMonitorToAvatar: profile.profile.avatarUrls[0].avatarUrl
        }
      })
    }

    if (data.psnMonitorToId) {
      const config = await prisma.config.findUnique({ where: { id: 1 } })
      const accessCode = await exchangeNpssoForAccessCode(config.psnNpsso)
      const authorization = await exchangeAccessCodeForAuthTokens(accessCode)
      const profile = await getProfileFromAccountId(authorization, data.psnMonitorToId)
      await prisma.config.update({
        where: { id: 1 },
        data: {
          psnMonitorToId: data.psnMonitorToId,
          psnMonitorToName: profile.onlineId,
          psnMonitorToAvatar: profile.avatars[2].url
        }
      })
    }

    if (data.psnMonitorInterval) {
      await prisma.config.update({
        where: { id: 1 },
        data: { psnMonitorInterval: data.psnMonitorInterval }
      })
      await startTask()
    }

    if (data.username) {
      await prisma.config.update({
        where: { id: 1 },
        data: { username: data.username }
      })
    }

    if (data.password) {
      await prisma.config.update({
        where: { id: 1 },
        data: { password: data.password }
      })
    }

    return sendResponse(request, {})
  } catch (error) {
    console.log(error)
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
