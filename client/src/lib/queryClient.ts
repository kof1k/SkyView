import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

function buildUrl(queryKey: readonly unknown[]): string {
  const [baseUrl, ...params] = queryKey;
  
  if (typeof baseUrl !== "string") {
    throw new Error("First element of queryKey must be a string URL");
  }
  
  // Handle geocoding endpoint
  if (baseUrl === "/api/geocoding" && params.length > 0) {
    const query = params[0];
    if (query && typeof query === "string") {
      return `${baseUrl}?query=${encodeURIComponent(query)}`;
    }
    return baseUrl;
  }
  
  // Handle weather endpoint
  if (baseUrl === "/api/weather" && params.length >= 2) {
    const [latitude, longitude] = params;
    if (latitude !== undefined && longitude !== undefined) {
      return `${baseUrl}?latitude=${latitude}&longitude=${longitude}`;
    }
    return baseUrl;
  }
  
  // Default: just use the base URL
  return baseUrl;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = buildUrl(queryKey);
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute for weather data
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
