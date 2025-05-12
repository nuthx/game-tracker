import { toast } from "sonner"
import { logger } from "@/lib/logger"

export async function handleRequest(method, api, values = null, type = "json") {
  try {
    const response = await fetch(api, {
      method: method,
      headers: type === "json" ? { "Content-Type": "application/json" } : {},
      body: values ? (type === "json" ? JSON.stringify(values) : values) : null
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message)
    }

    return await response.json()
  } catch (error) {
    toast.error(error.message)
    logger(error.message, "error")
  }
};

export function sendResponse(request, { code = 200, message = "success", data = null }) {
  const method = request.method
  const pathname = new URL(request.url).pathname

  if (code >= 300 && code <= 599) {
    logger(`${message} (${method} ${pathname})`, "error")
  }

  return Response.json({ code, message, data }, {
    status: code
  })
}
