import useSWR from "swr";

export const API = {
  CONFIG: "/api/config",
}

export function useData(url, options) {
  const fetcher = url => fetch(url).then(res => res.json()).then(({ data }) => data);
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    shouldRetryOnError: false,
    ...options
  });

  return { data, error, isLoading, mutate };
}
