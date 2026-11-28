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

  const visibleExperiences = data.experiences.filter((e) => e.visible);
  const visibleChannels = data.channels.filter((c) => c.visible && Boolean(c.url));
  const visibleEducation = data.education.filter((e) => e.visible);

  const isOnePage = density === "one-page";
  // Keep 6 flagship/management roles (incl. D'Kopian Cafe Manager) expanded in 1-Page Executive mode;
  // earlier 2021 studio roles condense into a single clean summary line while Full mode prints all 8.
  const primaryExperiences = isOnePage ? visibleExperiences.slice(0, 6) : visibleExperiences;
  const earlierExperiences = isOnePage ? visibleExperiences.slice(6) : [];

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
            {/* Layout Density Switch: 1-Page Executive vs Full 2-Page */}
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
            ? 'Print tip: Set paper to A4, Margins to Default, and uncheck "Headers and footers" for a spotless executive PDF.'
            : 'Tips cetak: Pilih kertas A4, Margin Default, lalu matikan centang "Header & Footer" agar pinggiran PDF bersih.'}
        </div>
      </div>

      {/* Swiss / European Executive A4 Printable Sheet (100% ATS Parseable) */}
      <main className="px-2 sm:px-6 pt-5 sm:pt-7">
        <article
          className={`print-sheet max-w-[794px] mx-auto bg-white text-[#141413] border border-[#dfddd6] shadow-sm ${
            isOnePage ? "p-5 sm:px-9 sm:py-7 space-y-3" : "p-6 sm:px-10 sm:py-9 space-y-4"
          }`}
        >
          {/* Executive Masthead */}
          <header className="resume-block border-b-[1.5px] border-[#141413] pb-3 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h1
                className={`font-display font-extrabold tracking-tight uppercase text-[#141413] ${
                  isOnePage ? "text-xl sm:text-[1.45rem]" : "text-2xl sm:text-[1.65rem]"
                }`}
              >
                {data.profile.fullName}
              </h1>
              <span className="font-mono-tech text-[11px] font-medium text-[#52514d] shrink-0">
                {pickText(data.profile.targetLocation, locale)}
              </span>
            </div>

            <p className="text-[13.5px] sm:text-[14px] font-bold text-[#8b3b18]">
              {pickText(data.profile.headline, locale)}
            </p>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-[#3a3936] pt-0.5">
              <span>{pickText(data.profile.location, locale)}</span>
              <span aria-hidden="true">•</span>
              <a href={`mailto:${data.profile.email}`} className="underline underline-offset-2">
                {data.profile.email}
              </a>
              <span aria-hidden="true">•</span>
              <span>{data.profile.whatsappDisplay}</span>
              <span aria-hidden="true">•</span>
              <a
                href={data.profile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                {data.profile.websiteUrl.replace(/^https?:\/\//, "")}
              </a>
              <span aria-hidden="true">•</span>
              <a
                href="https://www.malesan.my.id"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                malesan.my.id
              </a>
              {data.profile.linkedinUrl && (
                <>
                  <span aria-hidden="true">•</span>
                  <a
                    href={data.profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {data.profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </>
              )}
            </div>
          </header>

          {/* Professional Profile */}
          <section className="resume-block space-y-1">
            <h2 className="resume-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#141413] border-b border-[#d4d2ca] pb-0.5">
              {locale === "en" ? "Profile" : "Ringkasan Profesional"}
            </h2>
            <p className={`${isOnePage ? "text-[11.5px] leading-[1.42]" : "text-[12.5px] leading-relaxed"} text-[#22211f]`}>
              {pickText(data.profile.bio, locale)}
            </p>
          </section>

          {/* Verified Impact & Clickable Published Channels */}
          <section className="resume-block space-y-1">
            <h2 className="resume-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#141413] border-b border-[#d4d2ca] pb-0.5">
              {locale === "en" ? "Key Metrics & Published Work" : "Pencapaian & Tautan Karya"}
            </h2>
            <div className="grid grid-cols-3 gap-2 py-1 border-b border-[#eceae3]">
              {data.metrics.map((m) => (
                <div key={m.id} className="text-[11.5px]">
                  <strong className="font-display text-[13.5px] font-extrabold text-[#141413] mr-1.5">
                    {m.value}
                  </strong>
                  <span className="font-medium text-[#3a3936]">{pickText(m.label, locale)}</span>
                </div>
              ))}
            </div>
            {visibleChannels.length > 0 && (
              <p className="text-[11px] text-[#3a3936] leading-snug pt-0.5">
                <strong className="text-[#141413]">
                  {locale === "en" ? "Published Channels & SaaS: " : "Kanal & Produk Live: "}
                </strong>
                {visibleChannels.map((c, idx) => (
                  <span key={c.id}>
                    {idx > 0 ? "  •  " : ""}
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                      {c.handle}
                    </a>
                  </span>
                ))}
                {"  •  "}
                <a href="https://vt.tiktok.com/ZSs6TdjHb/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                  SanDisk (@eaonlineofficial)
                </a>
                {"  •  "}
                <a href="https://www.malesan.my.id" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                  Malesan AI (malesan.my.id)
                </a>
              </p>
            )}
          </section>

          {/* Work Experience */}
          <section className="space-y-2">
            <h2 className="resume-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#141413] border-b border-[#d4d2ca] pb-0.5">
              {locale === "en" ? "Experience" : "Pengalaman Kerja"}
            </h2>
            <div className={isOnePage ? "space-y-2" : "space-y-3"}>
              {primaryExperiences.map((exp) => {
                const rawBullets = pickList(exp.bullets, locale);
                const bulletsToShow = isOnePage ? rawBullets.slice(0, 2) : rawBullets;
                return (
                  <div key={exp.id} className="resume-entry space-y-0.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                      <h3 className={`${isOnePage ? "text-[12.5px]" : "text-[13px]"} font-bold text-[#141413]`}>
                        {pickText(exp.role, locale)}
                        <span className="font-medium text-[#4a4945]"> — {exp.organization}</span>
                      </h3>
                      <span className="font-mono-tech text-[10.5px] font-medium text-[#52514d] shrink-0">
                        {pickText(exp.period, locale)}
                      </span>
                    </div>
                    <ul
                      className={`list-disc pl-4 ${
                        isOnePage
                          ? "space-y-0 text-[11px] leading-[1.35]"
                          : "space-y-0.5 text-[12px] leading-snug"
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
                <p className="resume-entry text-[11px] text-[#3a3936] pt-0.5 border-t border-[#eceae3]">
                  <strong className="text-[#141413]">
                    {locale === "en" ? "Earlier Production Roles (2021–2022): " : "Riwayat Awal Produksi (2021–2022): "}
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

          {/* Tools & Capabilities */}
          <section className="resume-block space-y-1">
            <h2 className="resume-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#141413] border-b border-[#d4d2ca] pb-0.5">
              {locale === "en" ? "Production Tools & AI Workflow Stack" : "Software & Ekosistem AI"}
            </h2>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-0.5 ${isOnePage ? "text-[11px] leading-snug" : "text-[12px] leading-relaxed"} text-[#22211f]`}>
              {data.toolGroups.map((group) => (
                <p key={group.id}>
                  <strong className="text-[#141413]">{pickText(group.title, locale)}: </strong>
                  {group.items.join(", ")}
                </p>
              ))}
            </div>
          </section>

          {/* Languages & Optional Credentials */}
          <section className="resume-block space-y-1">
            <h2 className="resume-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#141413] border-b border-[#d4d2ca] pb-0.5">
              {locale === "en" ? "Languages & Availability" : "Bahasa & Ketersediaan"}
            </h2>
            {visibleEducation.length > 0 && (
              <div className="space-y-0.5">
                {visibleEducation.map((edu) => (
                  <p key={edu.id} className="text-[11.5px] text-[#22211f]">
                    <strong className="text-[#141413]">{pickText(edu.program, locale)}</strong> —{" "}
                    {edu.institution} ({edu.period})
                  </p>
                ))}
              </div>
            )}
            <div className={`flex flex-wrap items-center justify-between gap-2 ${isOnePage ? "text-[11px]" : "text-[12px]"} text-[#22211f]`}>
              <p>
                <strong className="text-[#141413]">
                  {locale === "en" ? "Languages: " : "Bahasa: "}
                </strong>
                {data.languages
                  .map((l) => `${pickText(l.name, locale)} (${pickText(l.level, locale)})`)
                  .join("  •  ")}
              </p>
              <p className="text-[#4a4945]">
                <strong className="text-[#141413]">
                  {locale === "en" ? "Availability: " : "Ketersediaan: "}
                </strong>
                {pickText(data.profile.availabilityBadge, locale)}
              </p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
