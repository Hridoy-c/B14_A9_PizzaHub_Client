"use client";

import { authClient } from "@/lib/auth-client";

/**
 * Client-side session read for Client Components.
 *
 * Server Components should import `getServerSession` from
 * "@/lib/cors/Session" instead — a module cannot be both.
 */
export const getClientSession = async () => {
  const { data, error } = await authClient.getSession();

  if (error) {
    return null;
  }

  return data;
};
