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
      {/* Screen Toolbar — Hidden when exporting PDF */}
      <div className="no-print sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-page)]/95 backdrop-blur-md">
        <div className="max-w-[850px] mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--text-muted)] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === "en" ? "Back to Portfolio" : "Kembali ke Portofolio"}</span>
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
              <span>{locale === "en" ? "Save / Print PDF" : "Simpan / Cetak PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pure ATS A4 Sheet */}
      <main className="px-4 pt-6 sm:pt-10">
        <article className="print-sheet max-w-[820px] mx-auto bg-white text-neutral-900 border border-neutral-200 rounded-xl shadow-sm p-6 sm:p-10 space-y-6">
          {/* Header */}
          <header className="border-b-2 border-neutral-900 pb-4 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-neutral-950">
              {data.profile.fullName}
            </h1>
            <p className="text-base font-semibold text-neutral-800">
              {pickText(data.profile.headline, locale)}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-700 pt-1">
              <span>{pickText(data.profile.location, locale)}</span>
              <span>•</span>
              <span>{pickText(data.profile.targetLocation, locale)}</span>
              <span>•</span>
              <a href={`mailto:${data.profile.email}`} className="underline">
                {data.profile.email}
              </a>
              <span>•</span>
              <span>{data.profile.whatsappDisplay}</span>
              <span>•</span>
              <a href={data.profile.websiteUrl} className="underline">
                {data.profile.websiteUrl.replace(/^https?:\/\//, "")}
              </a>
              {data.profile.linkedinUrl && (
                <>
                  <span>•</span>
                  <a href={data.profile.linkedinUrl} className="underline">
                    LinkedIn
                  </a>
                </>
              )}
            </div>
          </header>

          {/* Professional Summary */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1">
              {locale === "en" ? "Professional Summary" : "Ringkasan Profesional"}
            </h2>
            <p className="text-[13.5px] leading-relaxed text-neutral-800">
              {pickText(data.profile.bio, locale)}
            </p>
          </section>

          {/* Published Proof & Key Metrics */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1">
              {locale === "en" ? "Key Metrics & Published Channels" : "Hasil Utama & Kanal Aktif"}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-neutral-800 pt-1">
              {data.metrics.map((m) => (
                <li key={m.id} className="p-2.5 bg-neutral-50 border border-neutral-200 rounded">
                  <strong className="text-sm text-neutral-950 block">{m.value}</strong>
                  <span>{pickText(m.label, locale)}</span>
                </li>
              ))}
            </ul>
            {visibleChannels.length > 0 && (
              <p className="text-xs text-neutral-700 pt-1 leading-relaxed">
                <strong>{locale === "en" ? "Verified Links: " : "Tautan Bukti: "}</strong>
                {visibleChannels.map((c, idx) => (
                  <span key={c.id}>
                    {idx > 0 ? " | " : ""}
                    {c.label} ({c.handle})
                  </span>
                ))}
              </p>
            )}
          </section>

          {/* Work Experience */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1">
              {locale === "en" ? "Work Experience" : "Pengalaman Kerja"}
            </h2>
            <div className="space-y-4">
              {visibleExperiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                    <h3 className="text-sm font-bold text-neutral-950">
                      {pickText(exp.role, locale)} —{" "}
                      <span className="font-semibold text-neutral-700">{exp.organization}</span>
                    </h3>
                    <span className="text-xs font-medium text-neutral-600 shrink-0">
                      {pickText(exp.period, locale)}
                    </span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[13px] text-neutral-800 leading-snug">
                    {pickList(exp.bullets, locale).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Tools & Technical Capabilities */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1">
              {locale === "en" ? "Core Tools & AI Stack" : "Keahlian & Software"}
            </h2>
            <div className="space-y-1 text-[13px] text-neutral-800">
              {data.toolGroups.map((group) => (
                <p key={group.id}>
                  <strong className="text-neutral-950">{pickText(group.title, locale)}: </strong>
                  {group.items.join(", ")}
                </p>
              ))}
            </div>
          </section>

          {/* Education & Languages */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1">
              {locale === "en" ? "Education & Languages" : "Pendidikan & Bahasa"}
            </h2>
            <div className="space-y-2 text-[13px] text-neutral-800">
              {visibleEducation.map((edu) => (
                <div
                  key={edu.id}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1"
                >
                  <div>
                    <strong className="text-neutral-950">{pickText(edu.program, locale)}</strong> —{" "}
                    <span>{edu.institution}</span>
                    <p className="text-xs text-neutral-600">{pickText(edu.status, locale)}</p>
                  </div>
                  <span className="text-xs font-medium text-neutral-600 shrink-0">{edu.period}</span>
                </div>
              ))}
              <p className="pt-1">
                <strong className="text-neutral-950">
                  {locale === "en" ? "Languages: " : "Bahasa: "}
                </strong>
                {data.languages
                  .map((l) => `${pickText(l.name, locale)} (${pickText(l.level, locale)})`)
                  .join(" • ")}
              </p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
