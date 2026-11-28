"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { CvProfileData, pickText } from "@/types/cv";
import { useCvDraftPreview } from "@/lib/use-cv-draft";
import { ThemeLangControls, usePreferences } from "./ThemeLangControls";

interface AtsResumeViewProps {
  initialData: CvProfileData;
}

export function AtsResumeView({ initialData }: AtsResumeViewProps) {
  const { locale, setLocale, theme, toggleTheme } = usePreferences();
  const { data } = useCvDraftPreview(initialData);

  const visibleEducation = data.sections.showEducation
    ? data.education.filter((e) => e.visible)
    : [];

  const curatedRoles =
    locale === "en"
      ? [
          {
            title: "Creative Producer & Video Director — Hoki Jaya Motor, SanDisk, Damay Musik & DMP",
            period: "Jan 2024 – May 2026",
            body: "Scaled @hjm_hokijayamotor TikTok & @hokijaya_motor IG from 0 to 120K+ followers and 5M+ organic views; produced commercial SanDisk Phone Drive reel for EAONLINE Official (@eaonlineofficial); launched multi-cam YouTube music channels (@DamayMusikSubang, @ProjectDmp) to full monetization.",
          },
          {
            title: "AI Workflow & SaaS Builder — Malesan (malesan.my.id) & Independent R&D",
            period: "2025 – Present",
            body: "Engineered full-stack Next.js 16 & Supabase creator platform (Web, Windows, Android) automating viral hooks, FFmpeg/MediaPipe 9:16 clipping, Groq Whisper captions, ElevenLabs/AI voice prototyping, and Telegram workflows alongside Antigravity, Claude Code, Codex & Hermes Agent.",
          },
          {
            title: "Live Broadcast Producer, Host & Community Admin — Live Commerce & Nusantara ARK",
            period: "2026 – Present",
            body: "Configured OBS & TikTok Live Studio multi-scene broadcasts and hosted live sales streams; planned promotional campaigns, retention events, and server operations for Nusantara ARK Community.",
          },
          {
            title: "Cafe Manager & Earlier Studio Production — D'Kopian Cafe, Studio One & Freelance",
            period: "2021 – 2023",
            body: "Managed daily hospitality operations, staff shifts, inventory, cash flow & live acoustic sessions as Cafe Manager at D'Kopian Cafe (2022); edited commercial videos (2022–2023), engineered Studio One DAW tracking/mastering (2021–2022), and shot wedding photography (2021).",
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
            body: "Membangun aplikasi AI kreator Next.js 16 & Supabase (Web, Windows, Android) untuk riset hook, auto-clipping 9:16 FFmpeg/MediaPipe, subtitle Groq Whisper, AI voiceover/ElevenLabs, serta otomasi Telegram bersama Antigravity, Claude Code, Codex & Hermes Agent.",
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

      {/* Native 1:1 Pixel-Sharp Single A4 Editorial CV (Never blurry scaled text!) */}
      <main className="px-2 sm:px-6 pt-4 sm:pt-8">
        <article className="font-ats print-sheet max-w-[794px] mx-auto bg-white text-[#111111] border border-[#dedcd4] shadow-lg p-5 sm:px-11 sm:py-9 print:p-0 space-y-4 sm:space-y-4 print:space-y-3.5">
          {/* Masthead: Compact Sharp Portrait Left + Bold Clean Grotesque Name Right */}
          <header className="resume-block flex flex-row items-center gap-4 sm:gap-7 print:gap-6">
            <div className="shrink-0 w-[76px] h-[94px] sm:w-[106px] sm:h-[130px] print:w-[96px] print:h-[118px] bg-[#0b0b0d] overflow-hidden border border-[#111111]/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.profile.avatarUrl || "/images/profile-main.png"}
                alt={data.profile.fullName}
                className="w-full h-full object-cover object-top grayscale contrast-110"
              />
            </div>

            <div className="space-y-1 min-w-0">
              <h1 className="font-bold tracking-tight leading-[1.02] text-[#111111] text-[1.4rem] sm:text-[2.15rem] print:text-[2rem]">
                Muhammad Ryan
                <span className="block">Fadliansyah.</span>
              </h1>
              <p className="text-[12px] sm:text-[13.5px] print:text-[12.5px] font-semibold text-[#222222]">
                {pickText(data.profile.headline, locale)}
              </p>
              <p className="text-[11px] sm:text-[11.5px] print:text-[10.5px] text-[#4a4a4a]">
                {pickText(data.profile.location, locale)} • {pickText(data.profile.targetLocation, locale)}
              </p>
            </div>
          </header>

          {/* About Me */}
          <section className="resume-block space-y-1">
            <h2 className="text-[15px] sm:text-[17px] print:text-[15px] font-bold tracking-tight text-[#111111]">
              {locale === "en" ? "About Me" : "Tentang Saya"}
            </h2>
            <p className="text-[12.5px] sm:text-[11.5px] print:text-[10.8px] leading-[1.52] sm:leading-[1.48] text-[#1f1f1f]">
              {pickText(data.profile.bio, locale)}
            </p>
          </section>

          <hr className="border-t-[1.5px] border-[#111111]" />

          {/* Experience */}
          <section className="space-y-2.5 print:space-y-2">
            <h2 className="text-[15px] sm:text-[17px] print:text-[15px] font-bold tracking-tight text-[#111111]">
              {locale === "en" ? "Experience" : "Pengalaman"}
            </h2>

            <div className="space-y-2.5 sm:space-y-2.5 print:space-y-2">
              {curatedRoles.map((role) => (
                <div key={role.title} className="resume-entry space-y-0.5">
                  <p className="text-[12.5px] sm:text-[12px] print:text-[11px] font-bold text-[#111111] leading-snug">
                    {role.title}{" "}
                    <span className="font-semibold text-[#444444]">({role.period})</span>
                  </p>
                  <p className="text-[12px] sm:text-[11px] print:text-[10.3px] leading-[1.48] sm:leading-[1.42] text-[#222222]">
                    {role.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-t-[1.5px] border-[#111111]" />

          {/* Bottom Split Grid: 2 Columns on Tablet/Desktop/Print, Clean Readable Stack on Small Phone */}
          <section className="resume-block grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 gap-5 sm:gap-0 print:gap-0 items-stretch">
            {/* Left Column: Education + Languages + Contact */}
            <div className="sm:col-span-5 print:col-span-5 sm:pr-5 print:pr-5 sm:border-r-[1.5px] print:border-r-[1.5px] sm:border-[#111111] print:border-[#111111] space-y-3 sm:space-y-3 print:space-y-2.5">
              {visibleEducation.length > 0 && (
                <div className="space-y-0.5">
                  <h2 className="text-[15px] sm:text-[16px] print:text-[14px] font-bold tracking-tight text-[#111111]">
                    {locale === "en" ? "Education" : "Pendidikan"}
                  </h2>
                  {visibleEducation.map((edu) => (
                    <div
                      key={edu.id}
                      className="text-[12px] sm:text-[11px] print:text-[10.3px] leading-[1.42] text-[#1f1f1f]"
                    >
                      <p className="font-bold text-[#111111]">
                        {edu.institution}
                        {edu.period ? ` (${edu.period})` : ""}
                      </p>
                      <p className="text-[#3f3f3f]">{pickText(edu.program, locale)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-0.5">
                <h2 className="text-[15px] sm:text-[16px] print:text-[14px] font-bold tracking-tight text-[#111111]">
                  {locale === "en" ? "Languages" : "Bahasa"}
                </h2>
                <div className="text-[12px] sm:text-[11px] print:text-[10.3px] leading-[1.42] text-[#1f1f1f] space-y-0.5">
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

              <div className="space-y-0.5">
                <h2 className="text-[15px] sm:text-[16px] print:text-[14px] font-bold tracking-tight text-[#111111]">
                  {locale === "en" ? "Contact" : "Kontak"}
                </h2>
                <div className="text-[12px] sm:text-[11px] print:text-[10.2px] leading-[1.45] text-[#1f1f1f]">
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
                  <p className="text-[11px] sm:text-[10px] print:text-[9.5px] text-[#444444] pt-0.5">
                    TikTok @hjm_hokijayamotor • SanDisk @eaonlineofficial • YT @DamayMusikSubang • @ProjectDmp
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Capabilities */}
            <div className="sm:col-span-7 print:col-span-7 sm:pl-5 print:pl-5 space-y-2.5 print:space-y-2 border-t-[1.5px] sm:border-t-0 print:border-t-0 border-[#111111] pt-4 sm:pt-0 print:pt-0">
              <h2 className="text-[15px] sm:text-[16px] print:text-[14px] font-bold tracking-tight text-[#111111]">
                {locale === "en" ? "Capabilities" : "Kemampuan"}
              </h2>

              <div className="space-y-1">
                <p className="text-[12px] sm:text-[11.2px] print:text-[10.5px] font-bold text-[#111111]">
                  {locale === "en" ? "Technical & AI Production:" : "Kemampuan Teknis & AI:"}
                </p>
                <ul className="list-disc pl-4 space-y-1 print:space-y-0.5 text-[11.8px] sm:text-[10.8px] print:text-[10px] leading-[1.42] sm:leading-[1.38] text-[#1f1f1f]">
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
                <p className="text-[12px] sm:text-[11.2px] print:text-[10.5px] font-bold text-[#111111]">
                  {locale === "en" ? "Creative & Leadership:" : "Kemampuan Non-Teknis:"}
                </p>
                <ul className="list-disc pl-4 space-y-1 print:space-y-0.5 text-[11.8px] sm:text-[10.8px] print:text-[10px] leading-[1.42] sm:leading-[1.38] text-[#1f1f1f]">
                  {nonTechStrengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
