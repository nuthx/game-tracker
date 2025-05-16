import { prisma } from "@/lib/prisma"
import { startTask } from "@/lib/schedule"
import { sendResponse } from "@/lib/http/response"
import { getAuthorization } from "@/lib/auth"
import { getProfileFromUserName, getProfileFromAccountId } from "psn-api"

export async function GET(request) {
  try {
    const user = await prisma.user.findUnique({ where: { id: 1 } })
    return sendResponse(request, {
      data: {
        username: user.username,
        npsso: `${user.npsso.slice(0, 4)}****${user.npsso.slice(-4)}`,
        onlineId: user.onlineId,
        accountId: user.accountId,
        avatar: user.avatar,
        monitorId: user.monitorId,
        monitorName: user.monitorName,
        monitorAvatar: user.monitorAvatar,
        monitorInterval: user.monitorInterval
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

    if (data.new_npsso) {
      const authorization = await getAuthorization(data.new_npsso)
      const profile = await getProfileFromUserName(authorization, "me")
      await prisma.user.update({
        where: { id: 1 },
        data: {
          npsso: data.new_npsso,
          onlineId: profile.profile.onlineId,
          accountId: profile.profile.accountId,
          avatar: profile.profile.avatarUrls[0].avatarUrl,
          monitorName: profile.profile.onlineId,
          monitorAvatar: profile.profile.avatarUrls[0].avatarUrl
        }
      })
    }

    if (data.new_monitorId && data.new_monitorInterval) {
      const authorization = await getAuthorization()
      const profile = await getProfileFromAccountId(authorization, data.new_monitorId)
      await prisma.user.update({
        where: { id: 1 },
        data: {
          monitorId: data.new_monitorId,
          monitorName: profile.onlineId,
          monitorAvatar: profile.avatars[2].url,
          monitorInterval: data.new_monitorInterval
        }
      })
      await startTask()
    }

    if (data.new_username) {
      await prisma.user.update({
        where: { id: 1 },
        data: { username: data.new_username }
      })
    }

    if (data.new_password) {
      await prisma.user.update({
        where: { id: 1 },
        data: { password: data.new_password }
      })
    }

    return sendResponse(request, {})
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
