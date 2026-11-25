"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { CvProfileData, pickList, pickText } from "@/types/cv";
import { useCvDraftPreview } from "@/lib/use-cv-draft";
import { ThemeLangControls, usePreferences } from "./ThemeLangControls";

interface AtsResumeViewProps {
  initialData: CvProfileData;
}

export function AtsResumeView({ initialData }: AtsResumeViewProps) {
  const { locale, setLocale, theme, toggleTheme } = usePreferences();
  const { data } = useCvDraftPreview(initialData);

  const visibleExperiences = data.experiences.filter((e) => e.visible);
  const visibleChannels = data.channels.filter((c) => c.visible && Boolean(c.url));
  const visibleEducation = data.education.filter((e) => e.visible);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] pb-14">
      {/* Screen-only Toolbar — wraps cleanly on mobile, zero clipping */}
      <div className="no-print border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="max-w-[820px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--text-muted)] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === "en" ? "Back to Portfolio" : "Kembali ke Portofolio"}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
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
              <span>{locale === "en" ? "Save / Print PDF" : "Simpan / Cetak PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Swiss-Clean A4 Printable Sheet (100% ATS Parseable) */}
      <main className="px-3 sm:px-6 pt-6 sm:pt-8">
        <article className="print-sheet max-w-[790px] mx-auto bg-white text-[#141413] border border-[#dfddd6] shadow-sm p-6 sm:p-11 space-y-5">
          {/* Executive Masthead */}
          <header className="border-b-2 border-[#141413] pb-4 space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h1 className="font-display text-2xl sm:text-[1.85rem] font-extrabold tracking-tight uppercase text-[#141413]">
                {data.profile.fullName}
              </h1>
              <span className="text-xs font-medium text-[#5a5955] shrink-0">
                {pickText(data.profile.targetLocation, locale)}
              </span>
            </div>

            <p className="text-sm sm:text-[15px] font-semibold text-[#993513]">
              {pickText(data.profile.headline, locale)}
            </p>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-[#4a4945] pt-1">
              <span>{pickText(data.profile.location, locale)}</span>
              <span aria-hidden="true">|</span>
              <a href={`mailto:${data.profile.email}`} className="underline underline-offset-2">
                {data.profile.email}
              </a>
              <span aria-hidden="true">|</span>
              <span>{data.profile.whatsappDisplay}</span>
              <span aria-hidden="true">|</span>
              <a href={data.profile.websiteUrl} className="underline underline-offset-2">
                {data.profile.websiteUrl.replace(/^https?:\/\//, "")}
              </a>
              {data.profile.linkedinUrl && (
                <>
                  <span aria-hidden="true">|</span>
                  <a href={data.profile.linkedinUrl} className="underline underline-offset-2">
                    {data.profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </>
              )}
            </div>
          </header>

          {/* Professional Summary */}
          <section className="space-y-1.5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#141413] border-b border-[#d4d2ca] pb-1">
              {locale === "en" ? "Summary" : "Ringkasan Profesional"}
            </h2>
            <p className="text-[13px] leading-relaxed text-[#2b2a27]">
              {pickText(data.profile.bio, locale)}
            </p>
          </section>

          {/* Inline Key Outcomes & Verified Channels (No bulky gray cards) */}
          <section className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#141413] border-b border-[#d4d2ca] pb-1">
              {locale === "en" ? "Verified Impact & Published Work" : "Pencapaian & Tautan Bukti"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-1.5 border-b border-[#eceae3]">
              {data.metrics.map((m) => (
                <div key={m.id} className="text-[12.5px]">
                  <strong className="font-display text-base font-bold text-[#141413] mr-1.5">
                    {m.value}
                  </strong>
                  <span className="font-medium text-[#4a4945]">{pickText(m.label, locale)}</span>
                </div>
              ))}
            </div>
            {visibleChannels.length > 0 && (
              <p className="text-[12px] text-[#4a4945] leading-relaxed">
                <strong className="text-[#141413]">
                  {locale === "en" ? "Channels: " : "Kanal Aktif: "}
                </strong>
                {visibleChannels.map((c, idx) => (
                  <span key={c.id}>
                    {idx > 0 ? "  •  " : ""}
                    {c.label} ({c.handle})
                  </span>
                ))}
              </p>
            )}
          </section>

          {/* Work Experience */}
          <section className="space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#141413] border-b border-[#d4d2ca] pb-1">
              {locale === "en" ? "Experience" : "Pengalaman Kerja"}
            </h2>
            <div className="space-y-3.5">
              {visibleExperiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                    <h3 className="text-[13.5px] font-bold text-[#141413]">
                      {pickText(exp.role, locale)}
                      <span className="font-normal text-[#4a4945]"> — {exp.organization}</span>
                    </h3>
                    <span className="font-mono-tech text-[11px] font-medium text-[#5a5955] shrink-0">
                      {pickText(exp.period, locale)}
                    </span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[12.5px] text-[#2b2a27] leading-snug">
                    {pickList(exp.bullets, locale).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Tools & Capabilities */}
          <section className="space-y-1.5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#141413] border-b border-[#d4d2ca] pb-1">
              {locale === "en" ? "Production Tools & AI Workflow Stack" : "Software & Ekosistem AI"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[12.5px] text-[#2b2a27] pt-0.5">
              {data.toolGroups.map((group) => (
                <p key={group.id}>
                  <strong className="text-[#141413]">{pickText(group.title, locale)}: </strong>
                  {group.items.join(", ")}
                </p>
              ))}
            </div>
          </section>

          {/* Languages & Optional Credentials (Only renders education if explicitly enabled) */}
          <section className="space-y-1.5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#141413] border-b border-[#d4d2ca] pb-1">
              {locale === "en" ? "Languages & Availability" : "Bahasa & Ketersediaan"}
            </h2>
            {visibleEducation.length > 0 && (
              <div className="space-y-1 pb-1">
                {visibleEducation.map((edu) => (
                  <p key={edu.id} className="text-[12.5px] text-[#2b2a27]">
                    <strong className="text-[#141413]">{pickText(edu.program, locale)}</strong> —{" "}
                    {edu.institution} ({edu.period})
                  </p>
                ))}
              </div>
            )}
            <p className="text-[12.5px] text-[#2b2a27]">
              <strong className="text-[#141413]">
                {locale === "en" ? "Languages: " : "Bahasa: "}
              </strong>
              {data.languages
                .map((l) => `${pickText(l.name, locale)} (${pickText(l.level, locale)})`)
                .join("  •  ")}
            </p>
            <p className="text-[12.5px] text-[#4a4945]">
              <strong className="text-[#141413]">
                {locale === "en" ? "Availability: " : "Ketersediaan: "}
              </strong>
              {pickText(data.profile.availabilityBadge, locale)}
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
