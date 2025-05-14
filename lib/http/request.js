export async function handleRequest(method, api, values = null) {
  try {
    const response = await fetch(api, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: values ? JSON.stringify(values) : null
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw { code: responseData.code, message: responseData.message, data: responseData.data }
    }

    return {
      ok: true,
      code: responseData.code,
      message: responseData.message,
      data: responseData.data
    }
  } catch (error) {
    return {
      ok: false,
      code: error?.code || 500,
      message: error.message,
      data: error?.data || null
    }
  }
}
