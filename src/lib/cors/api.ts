const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const apiFetch = async (path: string, init: RequestInit = {}) => {
  const { getServerSession } = await import("@/lib/cors/Session");
  const session = await getServerSession();
  const token = session?.session.token;

  return fetch(`${BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};