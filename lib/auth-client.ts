import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";
import {
  clearAccessToken,
  getStoredAccessToken,
  saveAccessToken,
} from "@/lib/access-token";

export const authClient = createAuthClient({
  // Same-origin by default, so no hardcoded baseURL is needed in the browser.
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

/**
 * Returns a JWT access token for the Express API.
 * The browser sends the session cookie automatically (credentials: "include"),
 * so this only works for a logged-in user.
 *
 * Pass { force: true } right after login to always mint a fresh token.
 */
export async function getAccessToken({
  force = false,
}: { force?: boolean } = {}): Promise<string | null> {
  if (!force) {
    const cached = getStoredAccessToken();
    if (cached) {
      return cached;
    }
  }

  const response = await fetch("/api/auth/token", {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { token?: string };
  const token = data.token ?? null;
  saveAccessToken(token);
  return token;
}

export function clearAuthToken() {
  clearAccessToken();
}
