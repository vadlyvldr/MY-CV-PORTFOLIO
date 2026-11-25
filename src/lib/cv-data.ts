import rawCvData from "@/data/cv-data.json";
import { CvProfileData } from "@/types/cv";

export const DRAFT_STORAGE_KEY = "vadlycv_v2_draft_data";

/** Returns a deep copy of the committed cv-data.json payload. */
export function getDefaultCvData(): CvProfileData {
  return JSON.parse(JSON.stringify(rawCvData)) as CvProfileData;
}

/** Validates minimum structural integrity before persisting or publishing CV JSON. */
export function validateCvData(input: unknown): { ok: true; data: CvProfileData } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Payload must be a JSON object." };
  }
  const obj = input as Partial<CvProfileData>;
  if (!obj.profile || typeof obj.profile.fullName !== "string" || !obj.profile.fullName.trim()) {
    return { ok: false, error: "profile.fullName is required." };
  }
  if (!obj.profile.headline || typeof obj.profile.headline.en !== "string") {
    return { ok: false, error: "profile.headline.en is required." };
  }
  if (!Array.isArray(obj.caseStudies) || !Array.isArray(obj.experiences) || !Array.isArray(obj.toolGroups)) {
    return { ok: false, error: "caseStudies, experiences, and toolGroups must be arrays." };
  }
  if (!Array.isArray(obj.channels) || !Array.isArray(obj.metrics)) {
    return { ok: false, error: "channels and metrics must be arrays." };
  }
  return { ok: true, data: obj as CvProfileData };
}

/** Extracts an 11-character YouTube video ID from standard watch, short, embed, or youtu.be URLs. */
export function extractYouTubeId(input: string | undefined): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const vParam = url.searchParams.get("v");
    if (vParam && /^[A-Za-z0-9_-]{11}$/.test(vParam)) return vParam;
    const parts = url.pathname.split("/").filter(Boolean);
    const candidate = parts[parts.length - 1];
    if (candidate && /^[A-Za-z0-9_-]{11}$/.test(candidate)) return candidate;
  } catch {
    const match = trimmed.match(/(?:v=|\/)([A-Za-z0-9_-]{11})(?:[?&/]|$)/);
    if (match?.[1]) return match[1];
  }
  return "";
}
