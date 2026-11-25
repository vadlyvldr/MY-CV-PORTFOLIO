import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "vadly_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function getSigningSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PIN ||
    (process.env.NODE_ENV === "development" ? "vadlycv-local-dev-secret" : "")
  );
}

/** Checks whether the supplied PIN matches the configured server PIN (or dev default 159357 in NODE_ENV=development). */
export function verifyAdminPin(pinInput: string): {
  ok: boolean;
  reason?: "missing_server_pin" | "invalid_pin";
} {
  const configuredPin = process.env.ADMIN_PIN?.trim();
  if (!configuredPin) {
    if (process.env.NODE_ENV === "development") {
      return pinInput.trim() === "159357" ? { ok: true } : { ok: false, reason: "invalid_pin" };
    }
    return { ok: false, reason: "missing_server_pin" };
  }

  const a = Buffer.from(pinInput.trim());
  const b = Buffer.from(configuredPin);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: "invalid_pin" };
  }
  return { ok: true };
}

/** Creates an HMAC-signed stateless admin session token. */
export function createAdminSessionToken(nowSeconds = Math.floor(Date.now() / 1000)): string {
  const secret = getSigningSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET or ADMIN_PIN is not configured.");
  const exp = nowSeconds + SESSION_TTL_SECONDS;
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `${exp}.${nonce}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

/** Validates an HMAC-signed admin session token against expiration and signature tampering. */
export function verifyAdminSessionToken(
  token: string | undefined,
  nowSeconds = Math.floor(Date.now() / 1000)
): boolean {
  if (!token) return false;
  const secret = getSigningSecret();
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expStr, nonce, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < nowSeconds || !nonce || !sig) return false;

  const payload = `${expStr}.${nonce}`;
  const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
}
