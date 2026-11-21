"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "../cors/api";
import { requireUser } from "@/lib/cors/Session";
import { dashboardHome, dashboardRole } from "@/lib/roles";
import type { AddItemPayload } from "../types";

type ActionResponse = {
  ok: boolean;
  message?: string;
};

const readMessage = async (res: Response) => {
  const body = (await res.json().catch(() => null)) as {
    message?: string;
  } | null;

  return body?.message;
};

export const createPizzaPost = async (
  data: AddItemPayload,
): Promise<ActionResponse> => {
  try {
    const res = await apiFetch("/api/menu", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const message = await readMessage(res);

    if (!res.ok) {
      return {
        ok: false,
        message: message ?? `Could not create the item (${res.status})`,
      };
    }

    revalidatePath("/dashboard/vendor/menu");

    return { ok: true, message: message ?? "Menu item created successfully" };
  } catch (error) {
    console.error("Create menu item error:", error);

    return {
      ok: false,
      message: "Could not reach the server. Is the API running?",
    };
  }
};

export const setMenuItemStatus = async (
  id: string,
  status: "approved" | "rejected",
): Promise<ActionResponse> => {
  const user = await requireUser();
  if (dashboardRole(user.role) !== "admin") {
    redirect(dashboardHome(user.role));
  }

  if (!id) return { ok: false, message: "Missing item id" };

  try {
    const res = await apiFetch(
      `/api/admin/menu/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    );

    if (!res.ok) {
      const message = await readMessage(res);

      return {
        ok: false,
        message: message ?? `Could not update the item (${res.status})`,
      };
    }

    revalidatePath("/dashboard/admin/menu-items");
    revalidatePath("/menu");
    revalidatePath("/");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
};

const callMenuItem = async (
  id: string,
  method: "PATCH" | "DELETE",
  payload?: Record<string, unknown>,
): Promise<ActionResponse> => {
  const user = await requireUser();
  const role = dashboardRole(user.role);

  if (role !== "vendor" && role !== "admin") {
    return { ok: false, message: "You are not allowed to do that." };
  }

  if (!id) return { ok: false, message: "Missing item id" };

  try {
    const res = await apiFetch(`/api/menu/${encodeURIComponent(id)}`, {
      method,
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });

    const message = await readMessage(res);

    if (!res.ok) {
      return {
        ok: false,
        message: message ?? `Request failed (${res.status})`,
      };
    }

    revalidatePath("/dashboard/vendor/menu");
    revalidatePath("/menu");
    revalidatePath("/");

    return { ok: true, message };
  } catch (error) {
    console.error(`Menu item ${method} error:`, error);

    return {
      ok: false,
      message: "Could not reach the server. Is the API running?",
    };
  }
};

export const updateMenuItemAction = async (
  id: string,
  data: { name: string; description: string; price: number },
): Promise<ActionResponse> => callMenuItem(id, "PATCH", data);

export const deleteMenuItemAction = async (
  id: string,
): Promise<ActionResponse> => callMenuItem(id, "DELETE");