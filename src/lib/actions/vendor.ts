"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "../cors/api";
import { getCurrentUser } from "@/lib/cors/Session";
import { dashboardRole } from "@/lib/roles";

export type VendorProfileInput = {
  businessName: string;
  restaurantDescription: string;
  restaurantAddress: string;
  restaurantPhone: string;
};

export const updateVendorProfile = async (
  data: VendorProfileInput,
): Promise<{ ok: boolean; message?: string }> => {
  const user = await getCurrentUser();

  if (!user || dashboardRole(user.role) !== "vendor") {
    return { ok: false, message: "Only vendors can update this profile" };
  }

  if (!data.businessName.trim()) {
    return { ok: false, message: "Business name is required" };
  }

  try {
    const res = await apiFetch("/api/vendor/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    const body = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;

    if (!res.ok) {
      return {
        ok: false,
        message: body?.message ?? `Could not save (${res.status})`,
      };
    }

    revalidatePath("/dashboard/vendor/settings");
    return { ok: true };
  } catch {
    return { ok: false, message: "Could not reach the server." };
  }
};