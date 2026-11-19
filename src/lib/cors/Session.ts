import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type ClientSession = Awaited<ReturnType<typeof auth.api.getSession>>;
export type SessionUser = NonNullable<ClientSession>["user"];

/**
 * Reads the Better Auth session for the current request on the server.
 * Memoised per request, so layouts and pages can call it freely.
 *
 * This module is server-only. Client Components should use
 * `getClientSession` from "@/lib/auth-session-client" instead.
 */
export const getServerSession = cache(
  async (): Promise<ClientSession> =>
    auth.api.getSession({ headers: await headers() }),
);

/** The signed-in user, or `null` when nobody is signed in. */
export const getCurrentUser = async (): Promise<SessionUser | null> => {
  const session = await getServerSession();
  return session?.user ?? null;
};

/** Sends guests to the sign-in page and returns the signed-in user. */
export const requireUser = async (redirectTo = "/sign-in"): Promise<SessionUser> => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
};
