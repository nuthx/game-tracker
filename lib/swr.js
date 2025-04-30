import useSWR from "swr";

export const API = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",

  PRESENCE: "/api/presence",
  CONFIG: "/api/config",
  EXPORT: "/api/export",
}

export function useData(url, options) {
  const fetcher = url => fetch(url).then(res => res.json()).then(({ data }) => data);
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    shouldRetryOnError: false,
    ...options
  });

  return { data, error, isLoading, mutate };
}
