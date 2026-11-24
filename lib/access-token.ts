const STORAGE_KEY = "onrent_access_token";

// Kept in memory so we do not hit the network on every API call.
let memoryToken: string | null = null;

export function saveAccessToken(token: string | null) {
  memoryToken = token;

  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.sessionStorage.setItem(STORAGE_KEY, token);
  } else {
    window.sessionStorage.removeItem(STORAGE_KEY);
  }
}

export function getStoredAccessToken(): string | null {
  if (memoryToken) {
    return memoryToken;
  }

  if (typeof window === "undefined") {
    return null;
  }

  memoryToken = window.sessionStorage.getItem(STORAGE_KEY);
  return memoryToken;
}

export function clearAccessToken() {
  saveAccessToken(null);
}
