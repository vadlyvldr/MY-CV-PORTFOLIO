"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Eye, FileText, Printer, X } from "lucide-react";
import { Locale } from "@/types/cv";

interface ResumeLanguageModalProps {
  open: boolean;
  locale: Locale;
  onClose: () => void;
  onPrintLanguage: (lang: Locale) => void;
  onPreviewLanguage: (lang: Locale) => void;
}

/** Frosted-glass modal allowing visitors to pick English or Indonesian A4 CV print/preview. */
export function ResumeLanguageModal({
  open,
  locale,
  onClose,
  onPrintLanguage,
  onPreviewLanguage,
}: ResumeLanguageModalProps) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const isId = locale === "id";

  return createPortal(
    <div
      className="no-print fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={isId ? "Pilih Versi Bahasa Resume" : "Choose Resume Language"}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-[var(--text-primary)] leading-snug">
                {isId ? "Pilih Bahasa Resume (PDF)" : "Select Resume Version (PDF)"}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {isId
                  ? "Format 1 halaman A4 siap simpan PDF atau preview langsung."
                  : "Single-page A4 ATS CV ready to print as PDF or preview."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isId ? "Tutup pilihan bahasa" : "Close language dialog"}
            className="inline-flex items-center justify-center w-11 h-11 -mr-1.5 -mt-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] cursor-pointer transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* English Version */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] p-4 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-bold tracking-wide uppercase">
                EN • International
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                English Version
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isId
                  ? "Cocok untuk klien luar negeri, agensi global & tim remote internasional."
                  : "Best for global teams, remote roles & international recruiters."}
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onPrintLanguage("en")}
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] text-xs font-semibold cursor-pointer transition"
              >
                <Printer className="w-4 h-4" />
                <span>{isId ? "Cetak PDF (Inggris)" : "Print / Save PDF (EN)"}</span>
              </button>
              <button
                type="button"
                onClick={() => onPreviewLanguage("en")}
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)] text-[var(--text-primary)] text-xs font-semibold cursor-pointer transition"
              >
                <Eye className="w-4 h-4" />
                <span>{isId ? "Lihat Preview" : "Preview Resume"}</span>
              </button>
            </div>
          </div>

          {/* Indonesian Version */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] p-4 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-bold tracking-wide uppercase">
                ID • Indonesia
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Versi Indonesia
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isId
                  ? "Lengkap berbahasa Indonesia untuk HRD, brand lokal & agensi dalam negeri."
                  : "Full Indonesian translation tailored for local HR, brands & agencies."}
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onPrintLanguage("id")}
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] text-xs font-semibold cursor-pointer transition"
              >
                <Printer className="w-4 h-4" />
                <span>{isId ? "Cetak PDF (Indonesia)" : "Print / Save PDF (ID)"}</span>
              </button>
              <button
                type="button"
                onClick={() => onPreviewLanguage("id")}
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)] text-[var(--text-primary)] text-xs font-semibold cursor-pointer transition"
              >
                <Eye className="w-4 h-4" />
                <span>{isId ? "Lihat Preview" : "Preview Resume"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[var(--border-color)] bg-[var(--bg-page)] text-[11px] text-[var(--text-muted)] text-center">
          {isId
            ? "1 Halaman A4 • Putih Bersih • Otomatis Buka Dialog Simpan PDF"
            : "1-Page A4 • Clean Print Contrast • Instant Save-to-PDF Ready"}
        </div>
      </div>
    </div>,
    document.body
  );
}
