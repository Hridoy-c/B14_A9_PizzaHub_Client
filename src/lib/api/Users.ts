import { apiFetch } from "../cors/api";

export type AdminUser = {
  _id: string;
  name?: string | null;
  email?: string;
  role: string;
  createdAt: string;
};

export const getAllUsersForAdmin = async (): Promise<AdminUser[]> => {
  try {
    const res = await apiFetch("/api/admin/users");
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
};