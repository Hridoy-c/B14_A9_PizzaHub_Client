import type { Transaction } from "../types";
import { apiFetch } from "../cors/api";

export const getAllTransactionsForAdmin = async (): Promise<Transaction[]> => {
  try {
    const res = await apiFetch("/api/admin/transactions");
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
};