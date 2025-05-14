import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { prisma, initUser } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

export async function POST(request) {
  try {
    const data = await request.json()
    let user = await prisma.user.findUnique({ where: { id: 1 } })

    if (user) {
      if (data.username !== user.username || data.password !== user.password) {
        return sendResponse(request, {
          code: 401,
          message: "用户名或密码错误"
        })
      }
    } else {
      // Vercel: 用户不存在时创建默认用户
      await initUser()
      user = await prisma.user.findUnique({ where: { id: 1 } })
    }

    // 创建JWT
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    )

    // 设置cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: "tktk",
      value: token,
      sameSite: "strict",
      expires: new Date(Date.now() + 30 * 86400 * 1000)
    })

    return sendResponse(request, {})
  } catch (error) {
    return sendResponse(request, {
      code: 500,
      message: error.message
    })
  }
}
