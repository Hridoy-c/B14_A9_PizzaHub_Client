"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "../cors/api";

type CheckoutVerifyResult = {
  success: boolean;
  userId?: string;
  message?: string;
};

export type PlanStatus = {
  premium: boolean;
  plan: "free" | "premium";
  expiresAt: string | null;
  /** true hole status jana jayni (backend error), "Free" noy. */
  error?: boolean;
};

export const checkoutVerify = async (
  sessionId: string,
): Promise<CheckoutVerifyResult> => {
  try {
    const res = await apiFetch("/payments/checkout-verify", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });

    return await res.json();
  } catch {
    return { success: false, message: "Could not reach the payment service." };
  }
};

export const getPlanStatus = async (_userId?: string): Promise<PlanStatus> => {
  const free: PlanStatus = { premium: false, plan: "free", expiresAt: null };
  const failed: PlanStatus = { ...free, error: true };

  try {
    const res = await apiFetch("/payments/status");
    if (!res.ok) return failed;

    const body = await res.json();
    return {
      premium: Boolean(body.premium),
      plan: body.premium ? "premium" : "free",
      expiresAt: body.expiresAt ?? null,
    };
  } catch {
    return failed;
  }
};

export const cancelSubscription = async (): Promise<{
  ok: boolean;
  message?: string;
}> => {
  try {
    const res = await apiFetch("/payments/cancel-subscription", {
      method: "POST",
    });
    const body = (await res.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
    } | null;

    if (!res.ok || !body?.success) {
      return {
        ok: false,
        message: body?.message ?? `Could not cancel (${res.status})`,
      };
    }

    revalidatePath("/dashboard/vendor/subscription");
    revalidatePath("/dashboard/vendor");
    return { ok: true };
  } catch {
    return { ok: false, message: "Could not reach the server." };
  }
};