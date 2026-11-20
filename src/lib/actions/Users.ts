"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/cors/Session";
import { dashboardRole } from "@/lib/roles";

type ActionResponse = {
  ok: boolean;
  message?: string;
};

export const setUserBlocked = async (
  userId: string,
  blocked: boolean,
): Promise<ActionResponse> => {
  const currentAdmin = await requireUser();

  if (dashboardRole(currentAdmin.role) !== "admin") {
    return { ok: false, message: "Only admins can do this" };
  }

  if (!userId) {
    return { ok: false, message: "Missing user id" };
  }

  if (userId === currentAdmin.id) {
    return { ok: false, message: "You cannot block your own account" };
  }

  try {
    const requestHeaders = await headers();

    if (blocked) {
      await auth.api.banUser({
        body: { userId, banReason: "Blocked by an admin" },
        headers: requestHeaders,
      });
    } else {
      await auth.api.unbanUser({
        body: { userId },
        headers: requestHeaders,
      });
    }

    revalidatePath("/dashboard/admin/users");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Could not update the user",
    };
  }
};