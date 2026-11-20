import type { MenuItem, MenuItemStatus } from "../types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/** APIs return either a bare array or `{ data: [...] }`. */
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

/** A single menu item, or `null` when the id does not exist. */
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

/** Public vendor page: approved items only. */
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

/**
 * Vendor dashboard: every item the given vendor owns, including pending
 * and rejected ones. The page passes the id of the signed-in vendor.
 */
export const getMyMenu = async (vendorId: string): Promise<MenuItem[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/vendor/menu?vendorId=${encodeURIComponent(vendorId)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];

    return toList(await res.json());
  } catch {
    return [];
  }
};

/** Admin dashboard: every menu item, optionally filtered by status. */
export const getAllMenuForAdmin = async (
  status?: MenuItemStatus,
  cookie = "",
): Promise<MenuItem[]> => {
  try {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await fetch(`${BASE_URL}/api/admin/menu${query}`, {
      cache: "no-store",
      headers: { cookie },
    });
    if (!res.ok) return [];

    return toList(await res.json());
  } catch {
    return [];
  }
};
