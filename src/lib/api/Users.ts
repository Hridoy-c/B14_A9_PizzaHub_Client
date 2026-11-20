const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type AdminUser = {
  _id: string;
  name?: string | null;
  email?: string;
  role: string;
  createdAt: string;
};

/** Admin dashboard: every registered user. */
export const getAllUsersForAdmin = async (
  cookie = "",
): Promise<AdminUser[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/users`, {
      cache: "no-store",
      headers: { cookie },
    });
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
};