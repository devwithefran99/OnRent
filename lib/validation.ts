export type PasswordChecks = {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
};

/** Requirement: 6+ characters, at least one uppercase and one lowercase. */
export function getPasswordChecks(password: string): PasswordChecks {
  return {
    minLength: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  return Object.values(getPasswordChecks(password)).every(Boolean);
}

export function getPasswordError(password: string): string | null {
  const checks = getPasswordChecks(password);

  if (!checks.minLength) {
    return "Password must be at least 6 characters long.";
  }

  if (!checks.hasUppercase || !checks.hasLowercase) {
    return "Password must include at least one uppercase and one lowercase letter.";
  }

  return null;
}

/** Simple check for the "Photo (direct image link)" field. */
export function isValidImageUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
