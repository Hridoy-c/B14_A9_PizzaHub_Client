import type { Order } from "../types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getOrdersByCustomer = async (
  customerId: string,
): Promise<Order[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/orders/customer/${encodeURIComponent(customerId)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
};


export const getOrdersByVendor = async (
  vendorId: string,
): Promise<Order[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/orders/vendor/${encodeURIComponent(vendorId)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
};