import { prisma } from "@/lib/prisma"
import { startTask } from "@/lib/schedule"
import { sendResponse } from "@/lib/http"
import { updateNpsso } from "@/lib/update"

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
        monitorInterval: user.monitorInterval
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: 500,
      message: error.message
    })
  }
}

export async function PATCH(request) {
  try {
    const data = await request.json()

    if (data.new_npsso) {
      await prisma.user.update({
        where: { id: 1 },
        data: { npsso: data.new_npsso }
      })
      await updateNpsso(data.new_npsso)
    }

    if (data.new_monitorId && data.new_monitorInterval) {
      await prisma.user.update({
        where: { id: 1 },
        data: {
          monitorId: data.new_monitorId,
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
      code: 500,
      message: error.message
    })
  }
}
