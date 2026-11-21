import type { Order } from "../types";
import { apiFetch } from "../cors/api";

const toList = (json: unknown): Order[] => {
  if (Array.isArray(json)) return json as Order[];

  const data = (json as { data?: unknown } | null)?.data;
  return Array.isArray(data) ? (data as Order[]) : [];
};

export const getOrdersByCustomer = async (
  customerId: string,
): Promise<Order[]> => {
  try {
    const res = await apiFetch(
      `/api/orders/customer/${encodeURIComponent(customerId)}`,
    );
    if (!res.ok) return [];

    return toList(await res.json());
  } catch {
    return [];
  }
};

export const getOrdersByVendor = async (
  vendorId: string,
): Promise<Order[]> => {
  try {
    const res = await apiFetch(
      `/api/orders/vendor/${encodeURIComponent(vendorId)}`,
    );
    if (!res.ok) return [];

    return toList(await res.json());
  } catch {
    return [];
  }
};

export const getAllOrdersForAdmin = async (): Promise<Order[]> => {
  try {
    const res = await apiFetch("/api/admin/orders");
    if (!res.ok) return [];

    return toList(await res.json());
  } catch {
    return [];
  }
};