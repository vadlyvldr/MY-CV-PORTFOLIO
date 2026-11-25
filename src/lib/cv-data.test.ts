import { describe, expect, it } from "vitest";
import { extractYouTubeId, getDefaultCvData, validateCvData } from "./cv-data";
import { createAdminSessionToken, verifyAdminSessionToken } from "./admin-auth";
import { pickList, pickText } from "@/types/cv";

describe("cv-data integrity & helpers", () => {
  it("loads default committed cv-data.json cleanly and passes schema validation", () => {
    const data = getDefaultCvData();
    const res = validateCvData(data);
    expect(res.ok).toBe(true);
    expect(data.profile.nickname).toBe("Fadli");
    expect(data.caseStudies.length).toBeGreaterThanOrEqual(4);
    expect(data.experiences.length).toBeGreaterThanOrEqual(5);
  });

  it("rejects invalid payloads", () => {
    expect(validateCvData(null).ok).toBe(false);
    expect(validateCvData({ profile: { fullName: "" } }).ok).toBe(false);
  });

  it("extracts valid 11-char YouTube IDs across URL formats", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=yiLrKFxtcwE")).toBe("yiLrKFxtcwE");
    expect(extractYouTubeId("https://youtu.be/wpCI40ZEB0U?si=abc")).toBe("wpCI40ZEB0U");
    expect(extractYouTubeId("https://www.youtube.com/shorts/2OuW7O2wqts")).toBe("2OuW7O2wqts");
    expect(extractYouTubeId("Sqa29LvYK9A")).toBe("Sqa29LvYK9A");
    expect(extractYouTubeId("invalid")).toBe("");
  });

  it("picks EN text by default and supports ID localization", () => {
    const text = { en: "Creative Producer", id: "Produser Kreatif" };
    expect(pickText(text, "en")).toBe("Creative Producer");
    expect(pickText(text, "id")).toBe("Produser Kreatif");
    expect(pickList({ en: ["A"], id: [] }, "id")).toEqual(["A"]);
  });
});

describe("admin session signing", () => {
  it("verifies freshly signed token and rejects tampered or expired tokens", () => {
    process.env.ADMIN_SESSION_SECRET = "unit-test-secret-key";
    const now = 1_800_000_000;
    const token = createAdminSessionToken(now);
    expect(verifyAdminSessionToken(token, now + 60)).toBe(true);
    expect(verifyAdminSessionToken(token, now + 60 * 60 * 24)).toBe(false);
    expect(verifyAdminSessionToken(`${token}tamper`, now + 60)).toBe(false);
  });
});
