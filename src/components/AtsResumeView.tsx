"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { CvProfileData, pickText } from "@/types/cv";
import { useCvDraftPreview } from "@/lib/use-cv-draft";
import { ThemeLangControls, usePreferences } from "./ThemeLangControls";

interface AtsResumeViewProps {
  initialData: CvProfileData;
}

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1122;

export function AtsResumeView({ initialData }: AtsResumeViewProps) {
  const { locale, setLocale, theme, toggleTheme } = usePreferences();
  const { data } = useCvDraftPreview(initialData);
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Dynamically scale the fixed 794x1122px A4 paper canvas inside narrow phone viewports
  // so the exact 1-page editorial layout stays intact without stacking vertically.
  useEffect(() => {
    const node = outerRef.current;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width && width > 0) {
        setScale(Math.min(1, width / A4_WIDTH_PX));
      }
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const visibleEducation = data.sections.showEducation
    ? data.education.filter((e) => e.visible)
    : [];

  // Curated executive blocks mapped directly from Fadli's complete verified track record
  // so all experience stays crisp, airy, and readable inside 1 single A4 sheet.
  const curatedRoles =
    locale === "en"
      ? [
          {
            title: "Creative Producer & Video Director — Hoki Jaya Motor, SanDisk, Damay Musik & DMP",
            period: "Jan 2024 – May 2026",
            body: "Scaled @hjm_hokijayamotor TikTok & @hokijaya_motor IG from 0 to 120K+ followers and 5M+ organic views; produced commercial SanDisk Phone Drive reel for EAONLINE Official (@eaonlineofficial); launched and grew multi-cam live music YouTube channels (@DamayMusikSubang, @ProjectDmp) to full monetization.",
          },
          {
            title: "AI Workflow & SaaS Builder — Malesan (malesan.my.id) & Independent R&D",
            period: "2025 – Present",
            body: "Engineered full-stack Next.js 16 & Supabase creator platform (Web, Windows, Android) automating viral hooks, FFmpeg/MediaPipe 9:16 clipping, Groq Whisper captions, AI TTS/ElevenLabs voice prototyping, and Telegram workflows alongside Antigravity, Claude Code, Codex & Hermes Agent.",
          },
          {
            title: "Live Broadcast Producer, Host & Community Admin — Live Commerce & Nusantara ARK",
            period: "2026 – Present",
            body: "Configured OBS & TikTok Live Studio multi-scene commercial broadcasts and hosted real-time product conversion streams; planned promotional campaigns, retention events, and daily operations for Nusantara ARK Community.",
          },
          {
            title: "Cafe Manager & Earlier Studio Production — D'Kopian Cafe, Studio One & Freelance",
            period: "2021 – 2023",
            body: "Managed daily hospitality operations, staff shifts, inventory, cash flow & acoustic sessions as Cafe Manager at D'Kopian Cafe (2022); edited commercial videos (2022–2023), engineered Studio One DAW tracking/mastering (2021–2022), and photographed traditional weddings (2021).",
          },
        ]
      : [
          {
            title: "Creative Producer & Video Director — Hoki Jaya Motor, SanDisk, Damay Musik & DMP",
            period: "Jan 2024 – Mei 2026",
            body: "Membangun TikTok @hjm_hokijayamotor & IG @hokijaya_motor dari 0 hingga 120K+ followers dan 5 Juta+ views organik; memproduksi video iklan SanDisk Phone Drive (@eaonlineofficial); merintis channel musik YouTube multi-kamera (@DamayMusikSubang, @ProjectDmp) hingga monetisasi.",
          },
          {
            title: "AI Workflow & SaaS Builder — Malesan (malesan.my.id) & Riset Mandiri",
            period: "2025 – Sekarang",
            body: "Membangun aplikasi AI kreator Next.js 16 & Supabase (Web, Windows, Android) untuk hook viral, auto-clipping 9:16 FFmpeg/MediaPipe, subtitle Groq Whisper, AI voiceover/ElevenLabs, serta otomasi Telegram bersama Antigravity, Claude Code, Codex & Hermes Agent.",
          },
          {
            title: "Live Broadcast Host & Community Admin — Siaran Live & Nusantara ARK",
            period: "2026 – Sekarang",
            body: "Mengatur multi-scene OBS & TikTok Live Studio serta membawakan siaran penjualan real-time; mengelola kampanye promosi, event retensi pemain, dan operasional server komunitas Nusantara ARK.",
          },
          {
            title: "Cafe Manager & Riwayat Produksi Awal — D'Kopian Cafe, Audio Studio & Freelance",
            period: "2021 – 2023",
            body: "Memimpin operasional harian, jadwal staf, stok bahan & arus kas sebagai Manajer Kafe D'Kopian Cafe (2022); video editor komersial (2022–2023), operator mixing/mastering Studio One DAW (2021–2022), serta fotografer wedding tradisional (2021).",
          },
        ];

  const nonTechStrengths =
    locale === "en"
      ? [
          "Retention-led storytelling & hook strategy",
          "Solo end-to-end & team production leadership",
          "Operations scheduling & deadline execution",
        ]
      : [
          "Komunikasi visual, storytelling & strategi hook",
          "Produksi solo end-to-end & koordinasi tim",
          "Manajemen waktu, operasional & detail teknis",
        ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] pb-12">
      {/* Clean Minimalist Screen Toolbar */}
      <div className="no-print border-b border-[var(--border-color)] bg-[var(--bg-surface)] sticky top-0 z-30">
        <div className="max-w-[826px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--text-muted)] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === "en" ? "Back to Portfolio" : "Kembali"}</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeLangControls
              locale={locale}
              onChangeLocale={setLocale}
              theme={theme}
              onToggleTheme={toggleTheme}
            />

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{locale === "en" ? "Save / Print PDF" : "Simpan PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fixed-Ratio Single A4 Paper Sheet (Auto-scales cleanly inside phone screens!) */}
      <main className="px-3 sm:px-6 pt-5 sm:pt-8">
        <div
          ref={outerRef}
          className="print-scale-outer w-full max-w-[794px] mx-auto overflow-hidden shadow-lg border border-[#dedcd4]"
          style={{ height: `${Math.round(A4_HEIGHT_PX * scale)}px` }}
        >
          <article
            className="print-sheet w-[794px] min-h-[1122px] bg-white text-[#111111] px-12 py-11 flex flex-col justify-between"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <div className="space-y-5">
              {/* Editorial Poster Masthead matching Reference */}
              <header className="flex items-center gap-7">
                <div className="shrink-0 w-[112px] h-[138px] bg-[#0b0b0d] overflow-hidden border border-[#111111]/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.profile.avatarUrl || "/images/profile-main.png"}
                    alt={data.profile.fullName}
                    className="w-full h-full object-cover object-top grayscale contrast-110"
                  />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <h1 className="font-display font-extrabold tracking-[-0.035em] leading-[0.95] text-[#111111] text-[2.45rem]">
                    Muhammad Ryan
                    <span className="block">Fadliansyah.</span>
                  </h1>
                  <p className="text-[14px] font-bold text-[#2b2a27] pt-0.5">
                    {pickText(data.profile.headline, locale)}
                  </p>
                  <p className="text-[11.5px] font-medium text-[#52514d]">
                    {pickText(data.profile.location, locale)} • {pickText(data.profile.targetLocation, locale)}
                  </p>
                </div>
              </header>

              {/* About Me */}
              <section className="space-y-1.5">
                <h2 className="font-display text-[19px] font-extrabold tracking-tight text-[#111111]">
                  {locale === "en" ? "About Me" : "Tentang Saya"}
                </h2>
                <p className="text-[11.8px] leading-[1.52] text-[#22211f]">
                  {pickText(data.profile.bio, locale)}
                </p>
              </section>

              <hr className="border-t-[1.5px] border-[#111111]" />

              {/* Experience */}
              <section className="space-y-3">
                <h2 className="font-display text-[19px] font-extrabold tracking-tight text-[#111111]">
                  {locale === "en" ? "Experience" : "Pengalaman"}
                </h2>

                <div className="space-y-3">
                  {curatedRoles.map((role) => (
                    <div key={role.title} className="space-y-0.5">
                      <p className="text-[12.2px] font-bold text-[#111111]">
                        {role.title}{" "}
                        <span className="font-semibold text-[#4a4945]">({role.period})</span>
                      </p>
                      <p className="text-[11.3px] leading-[1.45] text-[#262522]">{role.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="border-t-[1.5px] border-[#111111]" />

              {/* Bottom Asymmetric Split Grid matching Reference */}
              <section className="grid grid-cols-12 items-stretch pt-0.5">
                {/* Left Column: Education + Languages + Contact */}
                <div className="col-span-5 pr-6 border-r-[1.5px] border-[#111111] space-y-4">
                  {visibleEducation.length > 0 && (
                    <div className="space-y-1">
                      <h2 className="font-display text-[18px] font-extrabold tracking-tight text-[#111111]">
                        {locale === "en" ? "Education" : "Pendidikan"}
                      </h2>
                      {visibleEducation.map((edu) => (
                        <div key={edu.id} className="text-[11.3px] leading-[1.42] text-[#22211f]">
                          <p className="font-bold text-[#111111]">
                            {edu.institution}
                            {edu.period ? ` (${edu.period})` : ""}
                          </p>
                          <p className="text-[#3f3e3a]">{pickText(edu.program, locale)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-1">
                    <h2 className="font-display text-[18px] font-extrabold tracking-tight text-[#111111]">
                      {locale === "en" ? "Languages" : "Bahasa"}
                    </h2>
                    <div className="text-[11.3px] leading-[1.42] text-[#22211f] space-y-0.5">
                      {data.languages.map((lang, idx) => (
                        <p key={idx}>
                          <strong className="font-semibold text-[#111111]">
                            {pickText(lang.name, locale)}:
                          </strong>{" "}
                          {pickText(lang.level, locale)}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-display text-[18px] font-extrabold tracking-tight text-[#111111]">
                      {locale === "en" ? "Contact" : "Kontak"}
                    </h2>
                    <div className="text-[11.2px] leading-[1.48] text-[#22211f]">
                      <p>{data.profile.whatsappDisplay}</p>
                      <p>
                        <a
                          href={`mailto:${data.profile.email}`}
                          className="underline underline-offset-2"
                        >
                          {data.profile.email}
                        </a>
                      </p>
                      <p>
                        <a
                          href={data.profile.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2"
                        >
                          {data.profile.websiteUrl.replace(/^https?:\/\//, "")}
                        </a>
                        {" • "}
                        <a
                          href="https://www.malesan.my.id"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2"
                        >
                          malesan.my.id
                        </a>
                      </p>
                      {data.profile.linkedinUrl && (
                        <p>
                          <a
                            href={data.profile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            {data.profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
                          </a>
                        </p>
                      )}
                      <p className="text-[10.2px] text-[#4a4945] pt-0.5">
                        TikTok @hjm_hokijayamotor • SanDisk @eaonlineofficial • YT @DamayMusikSubang • @ProjectDmp
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Capabilities */}
                <div className="col-span-7 pl-6 space-y-3.5">
                  <h2 className="font-display text-[18px] font-extrabold tracking-tight text-[#111111]">
                    {locale === "en" ? "Capabilities" : "Kemampuan"}
                  </h2>

                  <div className="space-y-1">
                    <p className="text-[11.5px] font-bold text-[#111111]">
                      {locale === "en" ? "Technical & AI Production:" : "Kemampuan Teknis & AI:"}
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] leading-[1.4] text-[#22211f]">
                      {data.toolGroups.map((group) => (
                        <li key={group.id}>
                          <strong className="text-[#111111]">
                            {pickText(group.title, locale)}:
                          </strong>{" "}
                          {group.items.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11.5px] font-bold text-[#111111]">
                      {locale === "en" ? "Creative & Leadership:" : "Kemampuan Non-Teknis:"}
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] leading-[1.4] text-[#22211f]">
                      {nonTechStrengths.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
