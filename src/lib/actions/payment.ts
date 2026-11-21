"use server";

import { apiFetch } from "../cors/api";

type CheckoutVerifyResult = {
  success: boolean;
  userId?: string;
  message?: string;
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

export const getPlanStatus = async (
  userId: string,
): Promise<{ premium: boolean }> => {
  try {
    const res = await apiFetch(
      `/payments/status?userId=${encodeURIComponent(userId)}`,
    );
    if (!res.ok) return { premium: false };

    return await res.json();
  } catch {
    return { premium: false };
  }
};