import { protectedMutation } from "../cors/server";
import { AddItemPayload } from "../types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const createPizzaPost = async (data: AddItemPayload) => {
  const api = `${BASE_URL}/api/menu/`;
  const res = await protectedMutation(api, "POST", data);
  return res;
};
