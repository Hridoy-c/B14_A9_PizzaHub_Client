import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type ClientSession = Awaited<ReturnType<typeof auth.api.getSession>>;
export type SessionUser = NonNullable<ClientSession>["user"];


export const getServerSession = cache(
  async (): Promise<ClientSession> =>
    auth.api.getSession({ headers: await headers() }),
);


export const getCurrentUser = async (): Promise<SessionUser | null> => {
  const session = await getServerSession();
  return session?.user ?? null;
};

export const requireUser = async (redirectTo = "/sign-in"): Promise<SessionUser> => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
};
