import { apiFetch } from "../cors/api";

export type VendorProfile = {
  name: string;
  email: string;
  image: string | null;
  businessName: string;
  restaurantDescription: string;
  restaurantAddress: string;
  restaurantPhone: string;
  plan: "free" | "premium";
  subscriptionExpiresAt: string | null;
};

export const getVendorProfile = async (): Promise<VendorProfile | null> => {
  try {
    const res = await apiFetch("/api/vendor/profile");
    if (!res.ok) return null;

    return (await res.json()) as VendorProfile;
  } catch {
    return null;
  }
};