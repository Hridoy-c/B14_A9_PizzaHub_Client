import { MenuItem } from "../types/menu-item";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getPizzas = async (): Promise<MenuItem[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/pizzas`, { cache: "no-store" });
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
};

export const getPizzasById = async (id: string) => {
  const api = `${BASE_URL}/api/pizzas/${id}`;
  const res = await fetch(api);
  return res.json();
}