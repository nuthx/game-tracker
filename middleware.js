import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request) {
  const token = request.cookies.get("tktk")
  const isAuthenticated = await verifyToken(token)

  // 如果登录，重定向到首页
  if (request.nextUrl.pathname === "/login") {
    return isAuthenticated
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next()
  }

  // 如果未登录，API和页面返回不同的响应
  if (!isAuthenticated) {
    return request.nextUrl.pathname.startsWith("/api")
      ? NextResponse.json({ code: 401, message: "Unauthorized", data: null }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

async function verifyToken(token) {
  if (!token) return false
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token.value, secret)
    return true
  } catch {
    return false
  }
}

export const config = {
  matcher: [
    "/api/config",
    "/api/export",
    "/api/presence",

    "/",
    "/settings",

    "/login" // 用于登录后重定向
  ]
}
