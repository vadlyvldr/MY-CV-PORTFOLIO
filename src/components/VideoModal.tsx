"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, X } from "lucide-react";

export interface VideoPreviewPayload {
  platform: "youtube" | "tiktok";
  id: string;
  title: string;
  sourceUrl?: string;
}

interface VideoModalProps {
  video: VideoPreviewPayload | null;
  onClose: () => void;
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!video) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [video, onClose]);

  if (!video || typeof document === "undefined") return null;

  const isTikTok = video.platform === "tiktok";
  const externalHref =
    video.sourceUrl ||
    (isTikTok
      ? `https://www.tiktok.com/video/${video.id}`
      : `https://www.youtube.com/watch?v=${video.id}`);

  const embedSrc = isTikTok
    ? `https://www.tiktok.com/player/v1/${video.id}?autoplay=1&music_info=1&description=1`
    : `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose}
    >
      <div
        className={`w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-2xl ${
          isTikTok ? "max-w-[380px]" : "max-w-4xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border-color)]">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {video.title}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            >
              <span>{isTikTok ? "TikTok" : "YouTube"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className={`relative w-full bg-black ${
            isTikTok ? "aspect-[9/16] max-h-[78vh] mx-auto" : "aspect-video"
          }`}
        >
          <iframe
            src={embedSrc}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
