"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { protectedMutation } from "../cors/server";
import { requireUser } from "@/lib/cors/Session";
import { dashboardHome, dashboardRole } from "@/lib/roles";
import type { AddItemPayload } from "../types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type ActionResponse = {
  ok: boolean;
  message?: string;
};

export const createPizzaPost = async (
  data: AddItemPayload,
): Promise<ActionResponse> => {
  try {
    const res = await protectedMutation(
      `${BASE_URL}/api/menu`,
      "POST",
      data,
    );

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        ok: false,
        message:
          body?.message ?? `Could not create the item (${res.status})`,
      };
    }

    revalidatePath("/dashboard/vendor/menu");

    return {
      ok: true,
      message: body?.message ?? "Menu item created successfully",
    };
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
): Promise<{ ok: boolean; message?: string }> => {
  // The API also checks this, but fail fast before leaving the app.
  const user = await requireUser();
  if (dashboardRole(user.role) !== "admin") {
    redirect(dashboardHome(user.role));
  }

  if (!id) return { ok: false, message: "Missing item id" };

  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/menu/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          cookie: (await headers()).get("cookie") ?? "",
        },
        body: JSON.stringify({ status }),
      },
    );

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;

      return {
        ok: false,
        message: body?.message ?? `Could not update the item (${res.status})`,
      };
    }

    // The admin list changes, and approved items appear on the public menu.
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


type MutationResult = { ok: boolean; message?: string };



const callMenuItem = async (
  id: string,
  method: "PATCH" | "DELETE",
  payload?: Record<string, unknown>,
): Promise<MutationResult> => {
  const user = await requireUser();
  const role = dashboardRole(user.role);

  // The API also checks this, but fail fast before leaving the app.
  if (role !== "vendor" && role !== "admin") {
    return { ok: false, message: "You are not allowed to do that." };
  }

  if (!id) return { ok: false, message: "Missing item id" };

  try {
    const res = await fetch(`${BASE_URL}/api/menu/${encodeURIComponent(id)}`, {
      method,
      headers: {
        "content-type": "application/json",
        cookie: (await headers()).get("cookie") ?? "",
      },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });

    const body = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;

    if (!res.ok) {
      return {
        ok: false,
        message: body?.message ?? `Request failed (${res.status})`,
      };
    }

    revalidatePath("/dashboard/vendor/menu");
    revalidatePath("/menu");
    revalidatePath("/");

    return { ok: true, message: body?.message };
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
): Promise<MutationResult> => callMenuItem(id, "PATCH", data);

export const deleteMenuItemAction = async (
  id: string,
): Promise<MutationResult> => callMenuItem(id, "DELETE");