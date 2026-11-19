import { MenuItem } from "../types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getPizzas = async (): Promise<MenuItem[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/menu`, { cache: "no-store" });
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
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


export const getMenuByVendor = async (vendorId: string): Promise<MenuItem[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/menu/vendor/${encodeURIComponent(vendorId)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
};
