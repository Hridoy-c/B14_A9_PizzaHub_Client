
import { headers } from "next/headers";

export const protectedMutation = async (
  api: string,
  method: string,
  data?: unknown,
): Promise<Response> => {
  const requestHeaders = await headers();

  const cookie = requestHeaders.get("cookie") ?? "";

  const res = await fetch(api, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
    cache: "no-store",
  });

  return res;
};
