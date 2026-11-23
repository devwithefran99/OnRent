import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  // Same-origin by default, so no hardcoded baseURL is needed in the browser.
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

/**
 * Returns a JWT access token for the Express API.
 * The browser sends the session cookie automatically (credentials: "include"),
 * so this only works for a logged-in user.
 */
export async function getAccessToken(): Promise<string | null> {
  const response = await fetch("/api/auth/token", {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { token?: string };
  return data.token ?? null;
}
