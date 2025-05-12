import useSWR from "swr"

export const API = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",

  PRESENCE: "/api/presence",
  CONFIG: "/api/config",

  RECORD: "/api/record",
  EXPORT: "/api/record/export",
  IMPORT: "/api/record/import"
}

export function useData(url, options) {
  const fetcher = async (url) => {
    const res = await fetch(url)
    const { message, data } = await res.json()
    if (res.ok) {
      return data
    } else {
      throw { code: res.status, message, data }
    }
  }

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    shouldRetryOnError: false,
    ...options
  })

  return { data, error, isLoading, mutate }
}
