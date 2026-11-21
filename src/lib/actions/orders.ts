"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "../cors/api";
import { getCurrentUser } from "@/lib/cors/Session";
import { dashboardRole } from "@/lib/roles";

type ActionResponse = {
  ok: boolean;
  message?: string;
};

export type CreateOrderInput = {
  itemId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
};

const readMessage = async (res: Response) => {
  const body = (await res.json().catch(() => null)) as {
    message?: string;
  } | null;

  return body?.message;
};

export const createOrder = async (
  input: CreateOrderInput,
): Promise<ActionResponse> => {
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
    const res = await apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        itemId: input.itemId,
        deliveryDate: input.deliveryDate,
        deliveryAddress,
        message,
      }),
    });

    if (!res.ok) {
      const error = await readMessage(res);

      return {
        ok: false,
        message: error ?? `Could not place the order (${res.status})`,
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
): Promise<ActionResponse> => {
  const user = await getCurrentUser();

  if (!user || dashboardRole(user.role) !== "vendor") {
    return { ok: false, message: "Only vendors can update orders" };
  }
  if (!orderId) return { ok: false, message: "Missing order id" };

  try {
    const res = await apiFetch(
      `/api/orders/${encodeURIComponent(orderId)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    );

    if (!res.ok) {
      const error = await readMessage(res);

      return {
        ok: false,
        message: error ?? `Could not update the order (${res.status})`,
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
): Promise<ActionResponse> => {
  const user = await getCurrentUser();

  if (!user) return { ok: false, message: "Please sign in first" };
  if (dashboardRole(user.role) !== "customer") {
    return { ok: false, message: "Only customers can cancel their orders" };
  }
  if (!orderId) return { ok: false, message: "Missing order id" };

  try {
    const res = await apiFetch(
      `/api/orders/${encodeURIComponent(orderId)}/cancel`,
      { method: "PATCH" },
    );

    if (!res.ok) {
      const error = await readMessage(res);

      return {
        ok: false,
        message: error ?? `Could not cancel the order (${res.status})`,
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