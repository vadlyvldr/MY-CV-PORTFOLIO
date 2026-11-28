"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { CvProfileData, Locale, pickText } from "@/types/cv";
import { useCvDraftPreview } from "@/lib/use-cv-draft";
import { ThemeLangControls, usePreferences } from "./ThemeLangControls";
import { ResumeLanguageModal } from "./ResumeLanguageModal";

interface AtsResumeViewProps {
  initialData: CvProfileData;
}

export function AtsResumeView({ initialData }: AtsResumeViewProps) {
  const { locale, setLocale, theme, toggleTheme } = usePreferences();
  const { data } = useCvDraftPreview(initialData);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const pendingPrintRef = useRef<Locale | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get("lang");
    const targetLang: Locale | null =
      paramLang === "en" || paramLang === "id" ? paramLang : null;

    if (targetLang) {
      setLocale(targetLang);
    }

    if (params.get("autoprint") === "1") {
      const resolvedLang: Locale = targetLang ?? locale;
      pendingPrintRef.current = resolvedLang;
      window.history.replaceState({}, "", `/cv?lang=${resolvedLang}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pendingPrintRef.current || locale !== pendingPrintRef.current) return;

    let cancelled = false;
    let rafId1 = 0;
    let rafId2 = 0;
    let timeoutId = 0;

    const triggerPrint = async () => {
      try {
        await document.fonts?.ready;
      } catch {
        // Ignore font wait issues on older engines
      }
      if (cancelled) return;
      rafId1 = window.requestAnimationFrame(() => {
        rafId2 = window.requestAnimationFrame(() => {
          timeoutId = window.setTimeout(() => {
            if (!cancelled) {
              pendingPrintRef.current = null;
              window.print();
            }
          }, 140);
        });
      });
    };

    void triggerPrint();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId1);
      window.cancelAnimationFrame(rafId2);
      window.clearTimeout(timeoutId);
    };
  }, [locale]);

  const visibleEducation = data.sections.showEducation
    ? data.education.filter((e) => e.visible)
    : [];

  const summaryText =
    locale === "en"
      ? "Creative Producer with 5+ years of hands-on experience across short-form social video, YouTube channel launches, studio audio mixing, and AI workflow automation. Scaled TikTok @hjm_hokijayamotor from zero to 120K+ followers and 5M+ organic views, produced SanDisk (@eaonlineofficial) commercial reels, and built Malesan AI SaaS (malesan.my.id)."
      : "Creative Producer berpengalaman 5+ tahun di produksi video short-form, rintisan channel YouTube termonetisasi, rekayasa audio studio, dan otomasi AI. Membangun TikTok @hjm_hokijayamotor dari nol ke 120K+ followers & 5 Juta+ views organik, memproduksi iklan SanDisk (@eaonlineofficial), serta merilis Malesan AI SaaS (malesan.my.id).";

  const curatedRoles =
    locale === "en"
      ? [
          {
            title: "Creative Producer — Hoki Jaya Motor, SanDisk, Damay Musik & DMP",
            period: "Jan 2024 – May 2026",
            bullets: [
              "Grew @hjm_hokijayamotor TikTok & @hokijaya_motor Instagram from 0 to 120K+ followers and 5M+ organic views through retention-led short-form hooks and editing.",
              "Produced commercial SanDisk Phone Drive TikTok reel (@eaonlineofficial); launched and scaled @DamayMusikSubang and @ProjectDmp music channels to full YouTube monetization.",
            ],
          },
          {
            title: "AI SaaS & Workflow Builder — Malesan (malesan.my.id)",
            period: "2025 – Present",
            bullets: [
              "Built full-stack Next.js 16 & Supabase creator app (Web, Desktop, Android) automating viral hooks, FFmpeg/MediaPipe 9:16 clipping, Groq Whisper captions & Telegram workflows.",
              "Integrated ElevenLabs voice prototyping and agentic tools (Antigravity, Claude Code, Codex, Hermes Agent) into daily content production pipelines.",
            ],
          },
          {
            title: "Live Broadcast Host & Community Admin — Live Commerce & Nusantara ARK",
            period: "2026 – Present",
            bullets: [
              "Directed multi-scene OBS & TikTok Live Studio commercial broadcasts and hosted real-time product conversion streams; led retention campaigns and daily operations for Nusantara ARK.",
            ],
          },
          {
            title: "Cafe Manager & Earlier Studio Production — D'Kopian Cafe & Studio",
            period: "2021 – 2023",
            bullets: [
              "Directed daily hospitality operations, staff scheduling, supplier inventory & cash flow as Cafe Manager at D'Kopian Cafe (2022).",
              "Edited commercial videos in Premiere Pro & CapCut (2022–2023), engineered Studio One DAW multi-track audio (2021–2022), and shot wedding photography (2021).",
            ],
          },
        ]
      : [
          {
            title: "Creative Producer — Hoki Jaya Motor, SanDisk, Damay Musik & DMP",
            period: "Jan 2024 – Mei 2026",
            bullets: [
              "Membesarkan TikTok @hjm_hokijayamotor & IG @hokijaya_motor dari 0 hingga 120K+ followers dan 5 Juta+ views organik melalui riset hook dan editing retensi.",
              "Memproduksi iklan SanDisk Phone Drive di @eaonlineofficial; merintis & mengarahkan produksi multi-kamera @DamayMusikSubang dan @ProjectDmp hingga monetisasi YouTube.",
            ],
          },
          {
            title: "AI SaaS & Workflow Builder — Malesan (malesan.my.id)",
            period: "2025 – Sekarang",
            bullets: [
              "Membangun platform kreator Next.js 16 & Supabase (Web, Desktop, Android) untuk riset hook, auto-clipping 9:16 FFmpeg/MediaPipe, subtitle Groq Whisper & bot Telegram.",
              "Mengintegrasikan ElevenLabs voiceover dan coding agent (Antigravity, Claude Code, Codex, Hermes Agent) ke alur kerja produksi kreatif harian.",
            ],
          },
          {
            title: "Live Broadcast Host & Community Admin — Siaran Live & Nusantara ARK",
            period: "2026 – Sekarang",
            bullets: [
              "Mengatur multi-scene OBS & TikTok Live Studio untuk siaran penjualan live serta mengelola kampanye promosi dan operasional harian komunitas Nusantara ARK.",
            ],
          },
          {
            title: "Cafe Manager & Riwayat Produksi Awal — D'Kopian Cafe & Studio",
            period: "2021 – 2023",
            bullets: [
              "Memimpin operasional harian, jadwal staf, inventaris & arus kas sebagai Manajer Kafe D'Kopian Cafe (2022).",
              "Menangani editing video komersial (2022–2023), rekayasa audio Studio One DAW (2021–2022), dan fotografi wedding tradisional (2021).",
            ],
          },
        ];

  const nonTechStrengths =
    locale === "en"
      ? [
          "Retention-led storytelling & hook strategy",
          "End-to-end solo & cross-team production lead",
          "Operations scheduling & deadline execution",
        ]
      : [
          "Komunikasi visual, storytelling & strategi hook",
          "Produksi solo end-to-end & koordinasi tim",
          "Manajemen waktu, operasional & detail teknis",
        ];

  return (
    <div className="cv-print-shell min-h-screen bg-[var(--bg-page)] pb-12 print:min-h-0 print:bg-white print:pb-0">
      {/* Screen-only Toolbar */}
      <div className="no-print border-b border-[var(--border-color)] bg-[var(--bg-surface)] sticky top-0 z-30">
        <div className="max-w-[820px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2.5">
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
              onClick={() => setPrintModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{locale === "en" ? "Save / Print PDF" : "Cetak / Simpan PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Balanced Full-Frame Single-Page A4 Editorial CV */}
      <main className="cv-print-main px-2 sm:px-6 pt-4 sm:pt-8 print:p-0 print:m-0">
        <article className="font-ats print-sheet max-w-[794px] mx-auto bg-white text-[#09090b] border border-[#dedcd4] shadow-lg p-5 sm:px-11 sm:py-10 print:p-0 space-y-4 sm:space-y-5 print:space-y-4">
          {/* Editorial Header: Portrait Left + Clean Geometric Poppins Name Right */}
          <header className="resume-block flex flex-row items-center gap-4 sm:gap-7 print:gap-6">
            <div className="shrink-0 w-[84px] h-[105px] sm:w-[114px] sm:h-[140px] print:w-[110px] print:h-[136px] bg-[#0b0b0d] overflow-hidden border border-[#111111]/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.profile.avatarUrl || "/images/profile-main.png"}
                alt={data.profile.fullName}
                className="w-full h-full object-cover object-top grayscale contrast-110"
              />
            </div>

            <div className="space-y-1.5 min-w-0">
              <h1 className="font-ats-display font-extrabold tracking-[-0.015em] leading-[1.02] text-[#09090b] text-[1.5rem] sm:text-[2.25rem] print:text-[2.15rem]">
                Muhammad Ryan
                <span className="block">Fadliansyah.</span>
              </h1>
              <p className="text-[13px] sm:text-[14px] print:text-[12.5px] font-semibold text-[#111111]">
                {pickText(data.profile.headline, locale)}
              </p>
              <p className="text-[11.5px] sm:text-[12px] print:text-[10.8px] text-[#333333] font-medium">
                {pickText(data.profile.location, locale)} • {pickText(data.profile.targetLocation, locale)}
              </p>
            </div>
          </header>

          {/* About Me */}
          <section className="resume-block space-y-1.5">
            <h2 className="font-ats-display text-[16px] sm:text-[18px] print:text-[15.5px] font-bold tracking-[-0.01em] text-[#09090b]">
              {locale === "en" ? "About Me" : "Tentang Saya"}
            </h2>
            <p className="text-[13px] sm:text-[12.2px] print:text-[10.4px] leading-[1.54] text-[#111111]">
              {summaryText}
            </p>
          </section>

          <hr className="border-t-[1.5px] border-[#111111]" />

          {/* Experience */}
          <section className="space-y-3 print:space-y-2.5">
            <h2 className="font-ats-display text-[16px] sm:text-[18px] print:text-[15.5px] font-bold tracking-[-0.01em] text-[#09090b]">
              {locale === "en" ? "Experience" : "Pengalaman"}
            </h2>

            <div className="space-y-3 sm:space-y-3.5 print:space-y-2.5">
              {curatedRoles.map((role) => (
                <div key={role.title} className="resume-entry space-y-1">
                  <div className="flex flex-col sm:flex-row print:flex-row sm:items-baseline print:items-baseline sm:justify-between print:justify-between gap-0.5">
                    <h3 className="text-[13px] sm:text-[12.2px] print:text-[10.8px] font-bold text-[#09090b] leading-snug">
                      {role.title}
                    </h3>
                    <span className="text-[11.5px] sm:text-[11px] print:text-[9.8px] font-semibold text-[#333333] shrink-0">
                      ({role.period})
                    </span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[12.8px] sm:text-[11.5px] print:text-[10.1px] leading-[1.46] text-[#111111]">
                    {role.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-t-[1.5px] border-[#111111]" />

          {/* Bottom Split Grid: Balanced Baseline Left vs Right */}
          <section className="resume-block grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 gap-5 sm:gap-0 print:gap-0 items-stretch pt-0.5">
            {/* Left Column: Education + Languages + Contact */}
            <div className="sm:col-span-5 print:col-span-5 sm:pr-6 print:pr-5 sm:border-r-[1.5px] print:border-r-[1.5px] sm:border-[#111111] print:border-[#111111] space-y-3.5 print:space-y-3">
              {visibleEducation.length > 0 && (
                <div className="space-y-1">
                  <h2 className="font-ats-display text-[15.5px] sm:text-[17px] print:text-[14.5px] font-bold tracking-[-0.01em] text-[#09090b]">
                    {locale === "en" ? "Education" : "Pendidikan"}
                  </h2>
                  {visibleEducation.map((edu) => (
                    <div
                      key={edu.id}
                      className="text-[12.5px] sm:text-[11.5px] print:text-[10.1px] leading-[1.44] text-[#111111]"
                    >
                      <p className="font-bold text-[#09090b]">
                        {edu.institution}
                        {edu.period ? ` (${edu.period})` : ""}
                      </p>
                      <p className="text-[#333333]">{pickText(edu.program, locale)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <h2 className="font-ats-display text-[15.5px] sm:text-[17px] print:text-[14.5px] font-bold tracking-[-0.01em] text-[#09090b]">
                  {locale === "en" ? "Languages" : "Bahasa"}
                </h2>
                <div className="text-[12.5px] sm:text-[11.5px] print:text-[10.1px] leading-[1.44] text-[#111111] space-y-0.5">
                  {data.languages.map((lang, idx) => (
                    <p key={idx}>
                      <strong className="font-semibold text-[#09090b]">
                        {pickText(lang.name, locale)}:
                      </strong>{" "}
                      {pickText(lang.level, locale)}
                    </p>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="font-ats-display text-[15.5px] sm:text-[17px] print:text-[14.5px] font-bold tracking-[-0.01em] text-[#09090b]">
                  {locale === "en" ? "Contact" : "Kontak"}
                </h2>
                <div className="text-[12.5px] sm:text-[11.5px] print:text-[10px] leading-[1.48] text-[#111111] space-y-0.5">
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
                  <p className="text-[11.2px] sm:text-[10.4px] print:text-[9.3px] text-[#333333] pt-0.5 leading-snug">
                    TikTok @hjm_hokijayamotor • SanDisk @eaonlineofficial • YT @DamayMusikSubang • @ProjectDmp
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Capabilities */}
            <div className="sm:col-span-7 print:col-span-7 sm:pl-6 print:pl-5 space-y-3 print:space-y-2.5 border-t-[1.5px] sm:border-t-0 print:border-t-0 border-[#111111] pt-4 sm:pt-0 print:pt-0">
              <h2 className="font-ats-display text-[15.5px] sm:text-[17px] print:text-[14.5px] font-bold tracking-[-0.01em] text-[#09090b]">
                {locale === "en" ? "Capabilities" : "Kemampuan"}
              </h2>

              <div className="space-y-1">
                <p className="text-[12.8px] sm:text-[11.8px] print:text-[10.2px] font-bold text-[#09090b]">
                  {locale === "en" ? "Technical & AI Production:" : "Kemampuan Teknis & AI:"}
                </p>
                <ul className="list-disc pl-4 space-y-1 print:space-y-0.5 text-[12.5px] sm:text-[11.2px] print:text-[9.9px] leading-[1.44] text-[#111111]">
                  {data.toolGroups.map((group) => (
                    <li key={group.id}>
                      <strong className="font-semibold text-[#09090b]">
                        {pickText(group.title, locale)}:
                      </strong>{" "}
                      {group.items.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <p className="text-[12.8px] sm:text-[11.8px] print:text-[10.2px] font-bold text-[#09090b]">
                  {locale === "en" ? "Creative & Leadership:" : "Kemampuan Non-Teknis:"}
                </p>
                <ul className="list-disc pl-4 space-y-1 print:space-y-0.5 text-[12.5px] sm:text-[11.2px] print:text-[9.9px] leading-[1.44] text-[#111111]">
                  {nonTechStrengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </article>
      </main>

      <ResumeLanguageModal
        open={printModalOpen}
        locale={locale}
        onClose={() => setPrintModalOpen(false)}
        onPrintLanguage={(lang) => {
          setPrintModalOpen(false);
          window.history.replaceState({}, "", `/cv?lang=${lang}`);
          if (locale === lang) {
            pendingPrintRef.current = null;
            window.requestAnimationFrame(() => {
              window.setTimeout(() => window.print(), 80);
            });
          } else {
            pendingPrintRef.current = lang;
            setLocale(lang);
          }
        }}
        onPreviewLanguage={(lang) => {
          setPrintModalOpen(false);
          setLocale(lang);
          window.history.replaceState({}, "", `/cv?lang=${lang}`);
        }}
      />
    </div>
  );
}
