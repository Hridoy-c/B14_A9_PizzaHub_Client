const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type CheckoutVerifyResult = {
  success: boolean;
  userId?: string;
  message?: string;
};

export const checkoutVerify = async (
  sessionId: string,
): Promise<CheckoutVerifyResult> => {
  try {
    const response = await fetch(`${BASE_URL}/payments/checkout-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
      cache: "no-store",
    });

    return await response.json();
  } catch {
    return { success: false, message: "Could not reach the payment service." };
  }
};

export const getPlanStatus = async (
  userId: string,
): Promise<{ premium: boolean }> => {
  try {
    const response = await fetch(
      `${BASE_URL}/payments/status?userId=${encodeURIComponent(userId)}`,
      { cache: "no-store" },
    );
    if (!response.ok) return { premium: false };

    return await response.json();
  } catch {
    return { premium: false };
  }
};