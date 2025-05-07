import useSWR from "swr";

export const API = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",

  PRESENCE: "/api/presence",
  CONFIG: "/api/config",
  EXPORT: "/api/export",
}

export function useData(url, options) {
  const fetcher = async (url) => {
    const res = await fetch(url);
    const { message, data } = await res.json();
    if (res.ok) {
      return data;
    } else {
      throw new Error(message);
    }
  };

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    shouldRetryOnError: false,
    ...options
  });

  return { data, error, isLoading, mutate };
}
