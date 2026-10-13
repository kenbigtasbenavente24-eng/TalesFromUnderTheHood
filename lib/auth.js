import { createHmac, timingSafeEqual } from "crypto";

export const COOKIE_NAME = "admin_session";

function sign(value) {
  return createHmac("sha256", process.env.ADMIN_PASSWORD || "")
    .update(value)
    .digest();
}

// Constant-time comparison. Both sides are hashed first so lengths always match.
function safeEqual(a, b) {
  return timingSafeEqual(sign(a), sign(b));
}

export function passwordMatches(input) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false; // fail closed if the env variable isn't set
  return safeEqual(String(input ?? ""), real);
}

// The cookie holds a token derived from the password, so changing the
// password logs out every existing session.
export function sessionToken() {
  return sign("admin-session").toString("hex");
}

export function isValidSession(cookieValue) {
  if (!process.env.ADMIN_PASSWORD || !cookieValue) return false;
  return safeEqual(String(cookieValue), sessionToken());
}
