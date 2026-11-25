"use client";

import { CaseStudyItem, Locale, pickText } from "@/types/cv";

interface CaseVisualProps {
  item: CaseStudyItem;
  locale: Locale;
}

/**
 * Renders an authentic 9:16 vertical reel editing storyboard frame for Short-Form works
 * when TikTok/Reels thumbnails are cross-origin blocked or image-free.
 */
export function ShortFormReelVisual({ item, locale }: CaseVisualProps) {
  const meta = item.reelMeta;
  const cue = meta ? pickText(meta.hookCue, locale) : pickText(item.tag, locale);
  const note = meta ? pickText(meta.aspectNote, locale) : pickText(item.impact, locale);

  return (
    <div className="relative w-full h-full bg-[#121215] text-[#f4f3ee] overflow-hidden flex items-center justify-center p-4 select-none">
      {/* Subtle production grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Left Timecode Metadata */}
      <div className="hidden sm:flex flex-col justify-between h-full py-1 pr-4 flex-1 min-w-0 relative z-10">
        <div className="space-y-1">
          <span className="font-mono-tech text-[10px] tracking-widest text-[#9a9891] uppercase block">
            {meta?.ratioLabel || "9:16 VERTICAL"}
          </span>
          <span className="font-mono-tech text-[11px] font-medium text-[#ec6d42] block">
            {meta?.durationLabel || "00:30 • REEL"}
          </span>
        </div>

        <p className="text-[11px] leading-snug text-[#c5c3bc] max-w-[160px]">{note}</p>

        {/* Timeline Track Ruler */}
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-[#ec6d42]" />
          </div>
          <div className="h-1 w-4/5 rounded-full bg-white/15" />
        </div>
      </div>

      {/* Central 9:16 Vertical Canvas Frame */}
      <div className="relative z-10 h-full aspect-[9/16] max-h-[210px] rounded-xl border border-white/20 bg-gradient-to-b from-[#1e1e23] to-[#111113] p-3 flex flex-col justify-between shadow-xl transition-transform duration-300 group-hover:scale-[1.03]">
        <div className="flex items-center justify-between gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ec6d42]" />
          <span className="font-mono-tech text-[9px] tracking-wider text-white/70 truncate">
            {meta?.handle || "@hjm_hokijayamotor"}
          </span>
        </div>

        <div className="space-y-1.5 my-auto">
          <p className="font-display text-xs font-bold leading-tight text-white">{cue}</p>
          <div className="flex items-end gap-0.5 h-4 pt-1" aria-hidden="true">
            {[40, 85, 55, 95, 70, 45, 90, 60, 80, 50].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-xs bg-white/35"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-1.5 font-mono-tech text-[9px] text-white/75">
          <span>REC</span>
          <span>1080×1920</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a crisp architectural pipeline diagram for AI-assisted media & engineering workflows.
 */
export function AiPipelineVisual({ locale }: { locale: Locale }) {
  const steps =
    locale === "en"
      ? [
          { code: "01", name: "Script & Hook", tool: "Claude Code / Codex" },
          { code: "02", name: "AI Voice & Audio", tool: "ElevenLabs + Studio One" },
          { code: "03", name: "Cut & Automation", tool: "Premiere + Antigravity / Hermes" },
        ]
      : [
          { code: "01", name: "Skrip & Hook", tool: "Claude Code / Codex" },
          { code: "02", name: "Suara & Audio AI", tool: "ElevenLabs + Studio One" },
          { code: "03", name: "Edit & Otomasi", tool: "Premiere + Antigravity / Hermes" },
        ];

  return (
    <div className="relative w-full h-full bg-[#121215] text-[#f4f3ee] p-4 sm:p-5 flex flex-col justify-between overflow-hidden select-none">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative z-10 flex items-center justify-between font-mono-tech text-[10px] text-[#9a9891]">
        <span>WORKFLOW ARCHITECTURE</span>
        <span className="text-[#ec6d42]">ACTIVE R&amp;D</span>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-2 my-auto">
        {steps.map((step) => (
          <div
            key={step.code}
            className="rounded-lg border border-white/15 bg-white/[0.04] p-2.5 flex flex-col justify-between gap-2 transition-colors group-hover:border-[#ec6d42]/60"
          >
            <span className="font-mono-tech text-[10px] text-[#ec6d42] font-semibold">
              {step.code}
            </span>
            <div>
              <p className="font-display text-xs font-bold text-white leading-tight">{step.name}</p>
              <p className="text-[10px] text-[#c5c3bc] mt-1 leading-tight">{step.tool}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between font-mono-tech text-[10px] text-[#9a9891] border-t border-white/10 pt-2">
        <span>VOICE • CODE • VIDEO</span>
        <span>FASTER ITERATION</span>
      </div>
    </div>
  );
}
