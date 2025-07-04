import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

export async function POST(request) {
  try {
    const data = await request.json()
    let config = await prisma.config.findUnique({ where: { id: 1 } })

    if (data.username !== config.username || data.password !== config.password) {
      throw { code: 401, message: "用户名或密码错误" }
    }

    // 创建JWT
    const token = jwt.sign(
      {
        userId: config.id,
        username: config.username
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
      code: error.code || 500,
      message: error.message
    })
  }
}
