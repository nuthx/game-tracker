import { toast } from "sonner"
import { logger } from "@/lib/logger"

export async function handleRequest(method, api, values = null) {
  try {
    const response = await fetch(api, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: values ? JSON.stringify(values) : null
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
}
