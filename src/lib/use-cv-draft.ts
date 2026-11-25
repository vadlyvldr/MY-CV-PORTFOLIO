"use client";

import { useSyncExternalStore } from "react";
import { CvProfileData } from "@/types/cv";
import { DRAFT_STORAGE_KEY, validateCvData } from "@/lib/cv-data";

const DRAFT_EVENT = "vadlycv-draft-updated";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(DRAFT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DRAFT_EVENT, callback);
  };
}

export function notifyDraftUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(DRAFT_EVENT));
  }
}

function getDraftSnapshotString(): string | null {
  try {
    return localStorage.getItem(DRAFT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getPreviewFlagSnapshot(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("preview") === "draft";
  } catch {
    return false;
  }
}

/** Subscribes to local browser draft preview state when `?preview=draft` is active. */
export function useCvDraftPreview(initialData: CvProfileData): {
  data: CvProfileData;
  isDraftPreview: boolean;
  hasLocalDraft: boolean;
  localDraftData: CvProfileData | null;
} {
  const raw = useSyncExternalStore(subscribe, getDraftSnapshotString, () => null);
  const previewMode = useSyncExternalStore(subscribe, getPreviewFlagSnapshot, () => false);

  let parsedDraft: CvProfileData | null = null;
  if (raw) {
    try {
      const checked = validateCvData(JSON.parse(raw));
      if (checked.ok) parsedDraft = checked.data;
    } catch {
      parsedDraft = null;
    }
  }

  const isDraftPreview = previewMode && parsedDraft !== null;
  return {
    data: isDraftPreview && parsedDraft ? parsedDraft : initialData,
    isDraftPreview,
    hasLocalDraft: parsedDraft !== null,
    localDraftData: parsedDraft,
  };
}
