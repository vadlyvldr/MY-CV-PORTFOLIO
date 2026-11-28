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

  const summaryText =
    locale === "en"
      ? "Creative Producer with 5+ years across short-form social video, YouTube channel monetization, studio audio, and AI workflows. Scaled TikTok @hjm_hokijayamotor to 120K+ followers & 5M+ views, produced SanDisk (@eaonlineofficial) commercial reels, and built Malesan AI SaaS (malesan.my.id)."
      : "Creative Producer berpengalaman 5+ tahun di produksi video short-form, monetisasi YouTube, rekayasa audio studio, dan AI workflow. Membangun TikTok @hjm_hokijayamotor hingga 120K+ followers & 5 Juta+ views, membuat iklan SanDisk (@eaonlineofficial), dan merilis Malesan AI SaaS (malesan.my.id).";

  const curatedRoles =
    locale === "en"
      ? [
          {
            title: "Creative Producer — Hoki Jaya Motor, SanDisk & YouTube Channels",
            period: "Jan 2024 – May 2026",
            body: "Grew @hjm_hokijayamotor & @hokijaya_motor from 0 to 120K+ followers and 5M+ views; produced commercial SanDisk Phone Drive reel (@eaonlineofficial); launched and monetized @DamayMusikSubang and @ProjectDmp.",
          },
          {
            title: "AI SaaS & Workflow Builder — Malesan (malesan.my.id)",
            period: "2025 – Present",
            body: "Built full-stack Next.js 16 & Supabase creator app (Web, Desktop, Android) automating viral hooks, FFmpeg/MediaPipe 9:16 clipping, Groq Whisper captions, ElevenLabs voice tools & Telegram workflows.",
          },
          {
            title: "Live Broadcast Host & Community Admin — Live Commerce & Nusantara ARK",
            period: "2026 – Present",
            body: "Directed OBS & TikTok Live multi-scene broadcasts and hosted live sales streams; ran promotional events and daily operations for Nusantara ARK Community.",
          },
          {
            title: "Cafe Manager & Earlier Production — D'Kopian Cafe & Studio",
            period: "2021 – 2023",
            body: "Led hospitality operations, staff shifts, inventory & cash flow at D'Kopian Cafe (2022); edited commercial videos (2022–2023), engineered Studio One DAW audio (2021–2022) & shot wedding photography (2021).",
          },
        ]
      : [
          {
            title: "Creative Producer — Hoki Jaya Motor, SanDisk & Channel YouTube",
            period: "Jan 2024 – Mei 2026",
            body: "Membesarkan @hjm_hokijayamotor & @hokijaya_motor dari 0 hingga 120K+ followers dan 5 Juta+ views; memproduksi iklan SanDisk Phone Drive (@eaonlineofficial); merintis @DamayMusikSubang & @ProjectDmp hingga monetisasi.",
          },
          {
            title: "AI SaaS & Workflow Builder — Malesan (malesan.my.id)",
            period: "2025 – Sekarang",
            body: "Membangun aplikasi AI kreator Next.js 16 & Supabase (Web, Desktop, Android) untuk riset hook, auto-clipping 9:16 FFmpeg/MediaPipe, subtitle Groq Whisper, ElevenLabs voice & otomasi Telegram.",
          },
          {
            title: "Live Broadcast Host & Community Admin — Siaran Live & Nusantara ARK",
            period: "2026 – Sekarang",
            body: "Mengatur siaran multi-scene OBS & TikTok Live Studio serta membawakan live commerce; menjalankan event promosi & operasional harian Nusantara ARK Community.",
          },
          {
            title: "Cafe Manager & Riwayat Produksi Awal — D'Kopian Cafe & Studio",
            period: "2021 – 2023",
            body: "Mengelola operasional harian, jadwal staf, stok & kas Manajer Kafe D'Kopian Cafe (2022); editor video komersial (2022–2023), mixing/mastering Studio One DAW (2021–2022) & fotografer wedding (2021).",
          },
        ];

  const nonTechStrengths =
    locale === "en"
      ? [
          "Retention-led storytelling & hook strategy",
          "Solo end-to-end & cross-team leadership",
          "Operations scheduling & deadline execution",
        ]
      : [
          "Komunikasi visual, storytelling & strategi hook",
          "Produksi solo end-to-end & koordinasi tim",
          "Manajemen waktu, operasional & detail teknis",
        ];

  return (
    <div className="cv-print-shell min-h-screen bg-[var(--bg-page)] pb-10 print:min-h-0 print:bg-white print:pb-0">
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
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{locale === "en" ? "Save / Print PDF" : "Simpan PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Crisp 1-Page Executive CV Sheet */}
      <main className="cv-print-main px-2 sm:px-6 pt-3 sm:pt-7 print:p-0 print:m-0">
        <article className="font-ats print-sheet max-w-[794px] mx-auto bg-white text-[#111111] border border-[#dedcd4] shadow-lg p-4 sm:px-11 sm:py-8 print:p-0 space-y-3 sm:space-y-4 print:space-y-3">
          {/* Editorial Header: Portrait Left + Clean Grotesque Name Right */}
          <header className="resume-block flex flex-row items-center gap-4 sm:gap-7 print:gap-6">
            <div className="shrink-0 w-[72px] h-[90px] sm:w-[104px] sm:h-[126px] print:w-[92px] print:h-[112px] bg-[#0b0b0d] overflow-hidden border border-[#111111]/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.profile.avatarUrl || "/images/profile-main.png"}
                alt={data.profile.fullName}
                className="w-full h-full object-cover object-top grayscale contrast-110"
              />
            </div>

            <div className="space-y-1 min-w-0">
              <h1 className="font-bold tracking-tight leading-[1.02] text-[#111111] text-[1.35rem] sm:text-[2.1rem] print:text-[1.95rem]">
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
            <h2 className="text-[14.5px] sm:text-[16.5px] print:text-[14.5px] font-bold tracking-tight text-[#111111]">
              {locale === "en" ? "About Me" : "Tentang Saya"}
            </h2>
            <p className="text-[12px] sm:text-[11.5px] print:text-[10.5px] leading-[1.48] sm:leading-[1.46] text-[#1f1f1f]">
              {summaryText}
            </p>
          </section>

          <hr className="border-t-[1.5px] border-[#111111]" />

          {/* Experience */}
          <section className="space-y-2 print:space-y-1.5">
            <h2 className="text-[14.5px] sm:text-[16.5px] print:text-[14.5px] font-bold tracking-tight text-[#111111]">
              {locale === "en" ? "Experience" : "Pengalaman"}
            </h2>

            <div className="space-y-2 sm:space-y-2.5 print:space-y-2">
              {curatedRoles.map((role) => (
                <div key={role.title} className="resume-entry space-y-0.5">
                  <p className="text-[12px] sm:text-[11.8px] print:text-[10.8px] font-bold text-[#111111] leading-snug">
                    {role.title}{" "}
                    <span className="font-semibold text-[#444444]">({role.period})</span>
                  </p>
                  <p className="text-[11.8px] sm:text-[11px] print:text-[10px] leading-[1.44] sm:leading-[1.4] text-[#222222]">
                    {role.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-t-[1.5px] border-[#111111]" />

          {/* Bottom Split Grid */}
          <section className="resume-block grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 gap-4 sm:gap-0 print:gap-0 items-stretch">
            {/* Left Column: Education + Languages + Contact */}
            <div className="sm:col-span-5 print:col-span-5 sm:pr-5 print:pr-5 sm:border-r-[1.5px] print:border-r-[1.5px] sm:border-[#111111] print:border-[#111111] space-y-2.5 print:space-y-2">
              {visibleEducation.length > 0 && (
                <div className="space-y-0.5">
                  <h2 className="text-[14.5px] sm:text-[15.5px] print:text-[13.5px] font-bold tracking-tight text-[#111111]">
                    {locale === "en" ? "Education" : "Pendidikan"}
                  </h2>
                  {visibleEducation.map((edu) => (
                    <div
                      key={edu.id}
                      className="text-[11.8px] sm:text-[11px] print:text-[10px] leading-[1.38] text-[#1f1f1f]"
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
                <h2 className="text-[14.5px] sm:text-[15.5px] print:text-[13.5px] font-bold tracking-tight text-[#111111]">
                  {locale === "en" ? "Languages" : "Bahasa"}
                </h2>
                <div className="text-[11.8px] sm:text-[11px] print:text-[10px] leading-[1.38] text-[#1f1f1f] space-y-0.5">
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
                <h2 className="text-[14.5px] sm:text-[15.5px] print:text-[13.5px] font-bold tracking-tight text-[#111111]">
                  {locale === "en" ? "Contact" : "Kontak"}
                </h2>
                <div className="text-[11.8px] sm:text-[11px] print:text-[9.8px] leading-[1.42] text-[#1f1f1f]">
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
                  <p className="text-[10.8px] sm:text-[9.8px] print:text-[9.2px] text-[#444444] pt-0.5">
                    TikTok @hjm_hokijayamotor • SanDisk @eaonlineofficial • YT @DamayMusikSubang • @ProjectDmp
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Capabilities */}
            <div className="sm:col-span-7 print:col-span-7 sm:pl-5 print:pl-5 space-y-2 print:space-y-1.5 border-t-[1.5px] sm:border-t-0 print:border-t-0 border-[#111111] pt-3 sm:pt-0 print:pt-0">
              <h2 className="text-[14.5px] sm:text-[15.5px] print:text-[13.5px] font-bold tracking-tight text-[#111111]">
                {locale === "en" ? "Capabilities" : "Kemampuan"}
              </h2>

              <div className="space-y-1">
                <p className="text-[11.8px] sm:text-[11px] print:text-[10px] font-bold text-[#111111]">
                  {locale === "en" ? "Technical & AI Production:" : "Kemampuan Teknis & AI:"}
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11.5px] sm:text-[10.6px] print:text-[9.6px] leading-[1.38] text-[#1f1f1f]">
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
                <p className="text-[11.8px] sm:text-[11px] print:text-[10px] font-bold text-[#111111]">
                  {locale === "en" ? "Creative & Leadership:" : "Kemampuan Non-Teknis:"}
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11.5px] sm:text-[10.6px] print:text-[9.6px] leading-[1.38] text-[#1f1f1f]">
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
