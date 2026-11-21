import type { MenuItem, MenuItemStatus } from "../types";
import { apiFetch } from "../cors/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const toList = (json: unknown): MenuItem[] => {
  if (Array.isArray(json)) return json as MenuItem[];

  const data = (json as { data?: unknown } | null)?.data;
  return Array.isArray(data) ? (data as MenuItem[]) : [];
};

export type MenuFilters = {
  q?: string;
  category?: string;
  location?: string;
};

export const getPizzas = async (
  filters: MenuFilters = {},
): Promise<MenuItem[]> => {
  try {
    const params = new URLSearchParams();

    if (filters.q) params.set("q", filters.q);
    if (filters.category) params.set("category", filters.category);
    if (filters.location) params.set("location", filters.location);

    const query = params.toString();

    const res = await fetch(
      `${BASE_URL}/api/menu${query ? `?${query}` : ""}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];

    return toList(await res.json());
  } catch {
    return [];
  }
};

export const getPizzasById = async (id: string): Promise<MenuItem | null> => {
  try {
    const res = await fetch(`${BASE_URL}/api/menu/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;

    const json = await res.json();
    const item = json?.data ?? json;

    if (!item || typeof item !== "object" || !item._id) return null;

    return item as MenuItem;
  } catch {
    return null;
  }
};

export const getMenuByVendor = async (
  vendorId: string,
): Promise<MenuItem[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/menu/vendor/${encodeURIComponent(vendorId)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];

    return toList(await res.json());
  } catch {
    return [];
  }
};

export const getMyMenu = async (vendorId: string): Promise<MenuItem[]> => {
  try {
    const res = await apiFetch(
      `/api/vendor/menu?vendorId=${encodeURIComponent(vendorId)}`,
    );
    if (!res.ok) return [];

    return toList(await res.json());
  } catch {
    return [];
  }
};

export const getAllMenuForAdmin = async (
  status?: MenuItemStatus,
): Promise<MenuItem[]> => {
  try {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await apiFetch(`/api/admin/menu${query}`);
    if (!res.ok) return [];

    return toList(await res.json());
  } catch {
    return [];
  }
};

export const getMenuCount = async (
  params: { vendorId?: string; status?: string[] } = {},
): Promise<{ count: number }> => {
  try {
    const search = new URLSearchParams();
    if (params.vendorId) search.set("vendorId", params.vendorId);
    if (params.status?.length) search.set("status", params.status.join(","));

    const res = await apiFetch(`/api/menu/count?${search}`);
    if (!res.ok) return { count: 0 };

    return await res.json();
  } catch {
    return { count: 0 };
  }
};