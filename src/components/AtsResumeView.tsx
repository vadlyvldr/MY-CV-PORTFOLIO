"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { CvProfileData, pickList, pickText } from "@/types/cv";
import { useCvDraftPreview } from "@/lib/use-cv-draft";
import { ThemeLangControls, usePreferences } from "./ThemeLangControls";

interface AtsResumeViewProps {
  initialData: CvProfileData;
}

type ResumeDensity = "one-page" | "full";

export function AtsResumeView({ initialData }: AtsResumeViewProps) {
  const { locale, setLocale, theme, toggleTheme } = usePreferences();
  const { data } = useCvDraftPreview(initialData);
  const [density, setDensity] = useState<ResumeDensity>("one-page");
  const [showPhoto, setShowPhoto] = useState(true);

  const visibleExperiences = data.experiences.filter((e) => e.visible);
  const visibleChannels = data.channels.filter((c) => c.visible && Boolean(c.url));
  const visibleEducation = data.sections.showEducation
    ? data.education.filter((e) => e.visible)
    : [];

  const isOnePage = density === "one-page";
  // In 1-Page A4 mode, feature 5 primary/management roles (incl. D'Kopian Cafe Manager 2022,
  // located cleanly without spilling onto Page 2) and condense remaining roles into 1 footer line.
  const onePageIds = [
    "exp-creative-producer",
    "exp-ai-builder",
    "exp-live-host",
    "exp-game-admin",
    "exp-cafe-manager",
  ];
  const primaryExperiences = isOnePage
    ? visibleExperiences.filter((e) => onePageIds.includes(e.id))
    : visibleExperiences;
  const earlierExperiences = isOnePage
    ? visibleExperiences.filter((e) => !onePageIds.includes(e.id))
    : [];

  const nonTechStrengths =
    locale === "en"
      ? [
          "Retention-led storytelling & hook architecture",
          "End-to-end solo & cross-functional team production",
          "Operations, scheduling & fast creative turnaround",
        ]
      : [
          "Komunikasi visual, storytelling & arsitektur hook",
          "Produksi solo end-to-end maupun koordinasi tim",
          "Manajemen waktu, operasional & eksekusi tenggat ketat",
        ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] pb-14">
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

          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Resume page format"
              className="inline-flex items-center h-9 p-0.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)]"
            >
              <button
                type="button"
                onClick={() => setDensity("one-page")}
                className={`h-8 px-2.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  isOnePage
                    ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {locale === "en" ? "1-Page A4" : "1 Halaman"}
              </button>
              <button
                type="button"
                onClick={() => setDensity("full")}
                className={`h-8 px-2.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  !isOnePage
                    ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {locale === "en" ? "Full (2 Pages)" : "Lengkap"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPhoto((prev) => !prev)}
              className="h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer"
            >
              {showPhoto
                ? locale === "en"
                  ? "Photo: On"
                  : "Foto: Aktif"
                : locale === "en"
                ? "Photo: Off"
                : "Foto: Nonaktif"}
            </button>

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
        <div className="max-w-[820px] mx-auto px-4 pb-2 text-[11px] text-[var(--text-muted)]">
          {locale === "en"
            ? 'Print tip: Set paper to A4, Margins to Default, and uncheck "Headers and footers" for spotless PDF borders.'
            : 'Tips cetak: Pilih kertas A4, Margin Default, dan matikan centang "Header & Footer" agar pinggiran PDF bersih.'}
        </div>
      </div>

      {/* Editorial Monochrome Swiss/Modern A4 Resume */}
      <main className="px-2 sm:px-6 pt-5 sm:pt-7">
        <article
          className={`print-sheet max-w-[794px] mx-auto bg-white text-[#111111] border border-[#dedcd4] shadow-sm ${
            isOnePage
              ? "p-5 sm:px-9 sm:py-6 space-y-2.5"
              : "p-6 sm:px-10 sm:py-9 space-y-4"
          }`}
        >
          {/* Editorial Poster Masthead: B&W Portrait Left + Bold Stacked Name Right */}
          <header className="resume-block flex flex-col sm:flex-row print:flex-row items-start sm:items-center print:items-center gap-4 sm:gap-6 print:gap-5">
            {showPhoto && (
              <div className="shrink-0 w-[84px] h-[102px] sm:w-[90px] sm:h-[110px] print:w-[86px] print:h-[104px] bg-[#0b0b0d] overflow-hidden border border-[#111111]/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.profile.avatarUrl || "/images/profile-main.png"}
                  alt={data.profile.fullName}
                  className="w-full h-full object-cover object-top grayscale contrast-110"
                />
              </div>
            )}

            <div className="space-y-1.5 min-w-0">
              <h1
                className={`font-display font-extrabold tracking-[-0.03em] leading-[0.96] text-[#111111] ${
                  isOnePage
                    ? "text-[1.75rem] sm:text-[2.25rem] print:text-[2.1rem]"
                    : "text-[2rem] sm:text-[2.5rem] print:text-[2.25rem]"
                }`}
              >
                Muhammad Ryan
                <span className="block">Fadliansyah.</span>
              </h1>
              <p className="text-[12.5px] sm:text-[13.5px] font-bold text-[#2b2a27] tracking-tight">
                {pickText(data.profile.headline, locale)}
              </p>
              <p className="text-[11px] text-[#4a4945] font-medium">
                {pickText(data.profile.location, locale)} • {pickText(data.profile.targetLocation, locale)}
              </p>
            </div>
          </header>

          {/* About / Profile + Key Outcomes */}
          <section className="resume-block space-y-1.5 pt-1">
            <h2 className="resume-heading font-display text-[15px] sm:text-[17px] font-extrabold tracking-tight text-[#111111]">
              {locale === "en" ? "About Me" : "Tentang Saya"}
            </h2>
            <p
              className={`${
                isOnePage ? "text-[11.2px] leading-[1.42]" : "text-[12.2px] leading-relaxed"
              } text-[#22211f]`}
            >
              {pickText(data.profile.bio, locale)}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-0.5 text-[11px] font-semibold text-[#111111]">
              {data.metrics.map((m) => (
                <span key={m.id}>
                  <strong className="font-display font-extrabold">{m.value}</strong>{" "}
                  <span className="font-normal text-[#3f3e3a]">{pickText(m.label, locale)}</span>
                </span>
              ))}
            </div>
          </section>

          <hr className="border-t-[1.5px] border-[#111111]" />

          {/* Experience */}
          <section className="space-y-1.5">
            <h2 className="resume-heading font-display text-[15px] sm:text-[16.5px] font-extrabold tracking-tight text-[#111111]">
              {locale === "en" ? "Experience" : "Pengalaman"}
            </h2>

            <div className={isOnePage ? "space-y-1.5" : "space-y-3"}>
              {primaryExperiences.map((exp, idx) => {
                const rawBullets = pickList(exp.bullets, locale);
                // Top 2 core roles get 2 impact bullets in 1-Page A4; supporting roles get 1 sharp line
                const bulletsToShow = isOnePage ? rawBullets.slice(0, idx < 2 ? 2 : 1) : rawBullets;
                return (
                  <div key={exp.id} className="resume-entry space-y-0.5">
                    <div className="flex flex-col sm:flex-row print:flex-row sm:items-baseline print:items-baseline sm:justify-between print:justify-between gap-0.5">
                      <h3
                        className={`${
                          isOnePage ? "text-[11.5px]" : "text-[12.8px]"
                        } font-bold text-[#111111]`}
                      >
                        {pickText(exp.role, locale)} —{" "}
                        <span className="font-semibold text-[#33322e]">{exp.organization}</span>
                      </h3>
                      <span className="text-[10.5px] font-semibold text-[#4a4945] shrink-0">
                        ({pickText(exp.period, locale)})
                      </span>
                    </div>
                    <ul
                      className={`list-disc pl-4 ${
                        isOnePage
                          ? "space-y-0 text-[10.5px] leading-[1.32]"
                          : "space-y-0.5 text-[11.8px] leading-snug"
                      } text-[#22211f]`}
                    >
                      {bulletsToShow.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {earlierExperiences.length > 0 && (
                <p className="resume-entry text-[10.2px] text-[#3a3936] pt-1 border-t border-[#e5e3dc] leading-snug">
                  <strong className="text-[#111111]">
                    {locale === "en" ? "Earlier Creative Roles: " : "Pengalaman Awal: "}
                  </strong>
                  {earlierExperiences
                    .map(
                      (e) =>
                        `${pickText(e.role, locale)} — ${e.organization} (${pickText(e.period, locale)})`
                    )
                    .join("  •  ")}
                </p>
              )}
            </div>
          </section>

          <hr className="border-t-[1.5px] border-[#111111]" />

          {/* Split 2-Column Editorial Footer (Vertical Center Rule matching reference layout) */}
          <section className="resume-block grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 gap-4 sm:gap-0 print:gap-0 items-stretch">
            {/* Left Column: Education + Languages + Contact & Links */}
            <div className="sm:col-span-5 print:col-span-5 sm:pr-5 print:pr-5 sm:border-r-[1.5px] print:border-r-[1.5px] sm:border-[#111111] print:border-[#111111] space-y-2.5">
              {visibleEducation.length > 0 && (
                <div className="space-y-1">
                  <h2 className="font-display text-[15px] sm:text-[16px] font-extrabold tracking-tight text-[#111111]">
                    {locale === "en" ? "Education" : "Pendidikan"}
                  </h2>
                  {visibleEducation.map((edu) => (
                    <div key={edu.id} className="text-[11px] leading-snug text-[#22211f]">
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
                <h2 className="font-display text-[15px] sm:text-[16px] font-extrabold tracking-tight text-[#111111]">
                  {locale === "en" ? "Languages" : "Bahasa"}
                </h2>
                <ul className="text-[11px] leading-snug text-[#22211f] space-y-0.5">
                  {data.languages.map((lang, idx) => (
                    <li key={idx}>
                      <strong className="font-semibold text-[#111111]">
                        {pickText(lang.name, locale)}:
                      </strong>{" "}
                      {pickText(lang.level, locale)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <h2 className="font-display text-[15px] sm:text-[16px] font-extrabold tracking-tight text-[#111111]">
                  {locale === "en" ? "Contact & Links" : "Kontak & Tautan"}
                </h2>
                <div className="text-[11px] leading-snug text-[#22211f] space-y-0.5">
                  <p>{data.profile.whatsappDisplay}</p>
                  <p>
                    <a href={`mailto:${data.profile.email}`} className="underline underline-offset-2">
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
                  {visibleChannels.length > 0 && (
                    <p className="text-[10px] text-[#4a4945] pt-0.5 leading-tight">
                      {visibleChannels.map((c, idx) => (
                        <span key={c.id}>
                          {idx > 0 ? " • " : ""}
                          <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline">
                            {c.handle}
                          </a>
                        </span>
                      ))}
                      {" • "}
                      <a href="https://vt.tiktok.com/ZSs6TdjHb/" target="_blank" rel="noopener noreferrer" className="underline">
                        SanDisk (@eaonlineofficial)
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Capabilities (Technical Stack + Core Strengths) */}
            <div className="sm:col-span-7 print:col-span-7 sm:pl-5 print:pl-5 space-y-2">
              <h2 className="font-display text-[15px] sm:text-[16px] font-extrabold tracking-tight text-[#111111]">
                {locale === "en" ? "Capabilities" : "Kemampuan"}
              </h2>

              <div className="space-y-1">
                <p className="text-[11px] font-bold text-[#111111]">
                  {locale === "en" ? "Technical & AI Production:" : "Kemampuan Teknis & AI:"}
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-[10.8px] leading-snug text-[#22211f]">
                  {data.toolGroups.map((group) => (
                    <li key={group.id}>
                      <strong className="text-[#111111]">{pickText(group.title, locale)}:</strong>{" "}
                      {group.items.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold text-[#111111]">
                  {locale === "en" ? "Creative & Leadership:" : "Kemampuan Non-Teknis:"}
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-[10.8px] leading-snug text-[#22211f]">
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
