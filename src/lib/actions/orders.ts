"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/cors/Session";
import { dashboardRole } from "@/lib/roles";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type CreateOrderInput = {
  itemId: string;
  deliveryDate: string; // YYYY-MM-DD
  deliveryAddress: string;
  message: string;
};

export const createOrder = async (
  input: CreateOrderInput,
): Promise<{ ok: boolean; message?: string }> => {
  const user = await getCurrentUser();

  if (!user) return { ok: false, message: "Please sign in to place an order" };
  if (dashboardRole(user.role) !== "customer") {
    return { ok: false, message: "Only customer accounts can place orders" };
  }

  const deliveryAddress = input.deliveryAddress.trim();
  const message = input.message.trim();
  const day = new Date(`${input.deliveryDate}T00:00:00Z`);

  if (!input.itemId) return { ok: false, message: "Missing item" };
  if (
    Number.isNaN(day.getTime()) ||
    day.getTime() < Date.now() - 24 * 60 * 60 * 1000
  ) {
    return { ok: false, message: "Choose today or a future date" };
  }
  if (deliveryAddress.length < 5) {
    return { ok: false, message: "Enter a full delivery address" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        itemId: input.itemId,
        customerId: user.id, // from the session, never from the browser
        deliveryDate: input.deliveryDate,
        deliveryAddress,
        message,
      }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;

      return {
        ok: false,
        message: body?.message ?? `Could not place the order (${res.status})`,
      };
    }

    revalidatePath("/dashboard/customer/orders");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
};


export const setOrderStatus = async (
  orderId: string,
  status: "accepted" | "rejected",
): Promise<{ ok: boolean; message?: string }> => {
  const user = await getCurrentUser();

  if (!user || dashboardRole(user.role) !== "vendor") {
    return { ok: false, message: "Only vendors can update orders" };
  }
  if (!orderId) return { ok: false, message: "Missing order id" };

  try {
    const res = await fetch(
      `${BASE_URL}/api/orders/${encodeURIComponent(orderId)}/status`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        // vendorId comes from the session, so a vendor can only update their own orders.
        body: JSON.stringify({ status, vendorId: user.id }),
      },
    );

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;

      return {
        ok: false,
        message: body?.message ?? `Could not update the order (${res.status})`,
      };
    }

    revalidatePath("/dashboard/vendor/orders");
    revalidatePath("/dashboard/customer/orders");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
};


export const cancelOrder = async (
  orderId: string,
): Promise<{ ok: boolean; message?: string }> => {
  const user = await getCurrentUser();

  if (!user) return { ok: false, message: "Please sign in first" };
  if (dashboardRole(user.role) !== "customer") {
    return { ok: false, message: "Only customers can cancel their orders" };
  }
  if (!orderId) return { ok: false, message: "Missing order id" };

  try {
    const res = await fetch(
      `${BASE_URL}/api/orders/${encodeURIComponent(orderId)}/cancel`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        // customerId সেশন থেকে আসছে, তাই অন্যের অর্ডার cancel করা যাবে না
        body: JSON.stringify({ customerId: user.id }),
      },
    );

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;

      return {
        ok: false,
        message: body?.message ?? `Could not cancel the order (${res.status})`,
      };
    }

    revalidatePath("/dashboard/customer/orders");
    revalidatePath("/dashboard/vendor/orders");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
};