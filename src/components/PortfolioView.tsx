"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Play,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import {
  CaseStudyCategory,
  CvProfileData,
  Locale,
  pickList,
  pickText,
} from "@/types/cv";
import { notifyDraftUpdated, useCvDraftPreview } from "@/lib/use-cv-draft";
import { ThemeLangControls, usePreferences } from "./ThemeLangControls";
import { VideoModal } from "./VideoModal";

interface PortfolioViewProps {
  initialData: CvProfileData;
}

const UI_COPY = {
  en: {
    navWork: "Work",
    navExp: "Experience",
    navTools: "Tools & AI",
    navContact: "Contact",
    navCv: "ATS CV",
    downloadCv: "Download CV (PDF)",
    contactMe: "Contact Me",
    channelsLabel: "Published Channels",
    workEyebrow: "Selected Case Studies",
    workTitle: "Proven creative output & production range",
    filterAll: "All",
    filterShort: "Short-Form & Social",
    filterYoutube: "YouTube & Live",
    filterAudio: "Audio & Photo",
    filterAi: "AI Workflows",
    playPreview: "Watch Preview",
    openChannel: "View Source",
    expEyebrow: "Track Record",
    expTitle: "Work Experience",
    toolsEyebrow: "Capabilities",
    toolsTitle: "Production Tools & AI Stack",
    eduEyebrow: "Background",
    eduTitle: "Education & Languages",
    contactEyebrow: "Direct Contact",
    contactTitle: "Available for creative production & AI-assisted content roles",
    contactDesc:
      "Open to full-time remote teams, EU relocation opportunities (Netherlands target), and project collaborations.",
    whatsApp: "WhatsApp",
    email: "Send Email",
    linkedin: "LinkedIn",
    atsAction: "Open Printable ATS Resume (PDF)",
    adminLink: "Edit via Admin",
    draftNotice: "Previewing local unpublished draft from /admin.",
    draftClear: "Reset to Live Version",
  },
  id: {
    navWork: "Karya",
    navExp: "Pengalaman",
    navTools: "Tools & AI",
    navContact: "Kontak",
    navCv: "CV ATS",
    downloadCv: "Download CV (PDF)",
    contactMe: "Hubungi Saya",
    channelsLabel: "Kanal Aktif",
    workEyebrow: "Studi Kasus Terpilih",
    workTitle: "Rekam jejak konten, audio & alur kerja AI",
    filterAll: "Semua",
    filterShort: "Short-Form & Sosmed",
    filterYoutube: "YouTube & Live",
    filterAudio: "Audio & Foto",
    filterAi: "AI Workflow",
    playPreview: "Putar Video",
    openChannel: "Lihat Bukti",
    expEyebrow: "Pengalaman Kerja",
    expTitle: "Perjalanan Karir",
    toolsEyebrow: "Kemampuan Teknis",
    toolsTitle: "Software Produksi & Ekosistem AI",
    eduEyebrow: "Latar Belakang",
    eduTitle: "Pendidikan & Bahasa",
    contactEyebrow: "Kontak Langsung",
    contactTitle: "Siap berkontribusi untuk tim kreatif, digital & remote global",
    contactDesc:
      "Terbuka untuk posisi remote penuh waktu, peluang relokasi Eropa (target Belanda), maupun kolaborasi proyek.",
    whatsApp: "WhatsApp",
    email: "Kirim Email",
    linkedin: "LinkedIn",
    atsAction: "Buka CV Standar ATS (PDF)",
    adminLink: "Kelola via Admin",
    draftNotice: "Sedang mempratinjau draf lokal dari /admin (belum dipublish).",
    draftClear: "Kembali ke Versi Live",
  },
} as const;

export function PortfolioView({ initialData }: PortfolioViewProps) {
  const { locale, setLocale, theme, toggleTheme } = usePreferences();
  const { data, isDraftPreview } = useCvDraftPreview(initialData);
  const [category, setCategory] = useState<"all" | CaseStudyCategory>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  const copy = UI_COPY[locale as Locale];

  const visibleChannels = useMemo(
    () => data.channels.filter((c) => c.visible && Boolean(c.url)),
    [data.channels]
  );

  const visibleCaseStudies = useMemo(() => {
    const active = data.caseStudies.filter((item) => item.visible);
    if (category === "all") return active;
    return active.filter((item) => item.category === category);
  }, [data.caseStudies, category]);

  const visibleExperiences = useMemo(
    () => data.experiences.filter((exp) => exp.visible),
    [data.experiences]
  );

  const filterTabs: { id: "all" | CaseStudyCategory; label: string }[] = [
    { id: "all", label: copy.filterAll },
    { id: "short-form", label: copy.filterShort },
    { id: "youtube", label: copy.filterYoutube },
    { id: "audio-photo", label: copy.filterAudio },
    { id: "ai-workflow", label: copy.filterAi },
  ];

  const clearDraftPreview = () => {
    window.history.replaceState({}, "", "/");
    notifyDraftUpdated();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Draft Banner */}
      {isDraftPreview && (
        <div className="bg-[var(--accent)] text-[var(--accent-ink)] px-4 py-2 text-xs font-medium flex flex-wrap items-center justify-center gap-3">
          <span>{copy.draftNotice}</span>
          <button
            type="button"
            onClick={clearDraftPreview}
            className="underline font-semibold cursor-pointer"
          >
            {copy.draftClear}
          </button>
        </div>
      )}

      {/* Sticky Editorial Navigation */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-page)]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-base tracking-tight text-[var(--text-primary)] shrink-0"
          >
            <span className="font-serif-editorial text-xl italic">{data.profile.nickname}</span>
            <span className="hidden sm:inline-block text-xs font-normal text-[var(--text-muted)]">
              / Creative Producer
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]"
          >
            <a href="#work" className="hover:text-[var(--text-primary)] transition">
              {copy.navWork}
            </a>
            <a href="#experience" className="hover:text-[var(--text-primary)] transition">
              {copy.navExp}
            </a>
            <a href="#tools" className="hover:text-[var(--text-primary)] transition">
              {copy.navTools}
            </a>
            <a href="#contact" className="hover:text-[var(--text-primary)] transition">
              {copy.navContact}
            </a>
            <Link href="/cv" className="hover:text-[var(--text-primary)] transition">
              {copy.navCv}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeLangControls
              locale={locale}
              onChangeLocale={setLocale}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
            <Link
              href="/cv"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] text-xs font-semibold transition shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{copy.downloadCv}</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-4 space-y-2">
            <a
              href="#work"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center h-11 px-3 rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              {copy.navWork}
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center h-11 px-3 rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              {copy.navExp}
            </a>
            <a
              href="#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center h-11 px-3 rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              {copy.navTools}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center h-11 px-3 rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              {copy.navContact}
            </a>
            <Link
              href="/cv"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-sm font-semibold"
            >
              <FileText className="w-4 h-4" />
              <span>{copy.downloadCv}</span>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-secondary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] shrink-0" />
                <span>{pickText(data.profile.availabilityBadge, locale)}</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[3.4rem] font-medium tracking-tight leading-[1.08] text-[var(--text-primary)]">
                  {data.profile.fullName}
                </h1>
                <p className="text-lg sm:text-xl font-semibold text-[var(--accent)]">
                  {pickText(data.profile.headline, locale)}
                </p>
              </div>

              <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                {pickText(data.profile.bio, locale)}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{pickText(data.profile.location, locale)}</span>
                </span>
                <span>•</span>
                <span>{pickText(data.profile.targetLocation, locale)}</span>
              </div>

              {/* Action Row — equal heights >= 44px */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/cv"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] text-sm font-semibold transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>{copy.downloadCv}</span>
                </Link>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)] text-[var(--text-primary)] text-sm font-semibold transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>{copy.contactMe}</span>
                </a>
                <a
                  href={data.profile.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)] text-[var(--text-primary)] text-sm font-semibold transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{copy.whatsApp}</span>
                </a>
              </div>
            </div>

            {/* Clean Portrait Frame */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="w-full max-w-[300px] sm:max-w-[340px] rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm">
                <div className="aspect-[4/5] bg-neutral-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.profile.avatarUrl || "/images/profile-main.png"}
                    alt={data.profile.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="px-4 py-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {data.profile.nickname}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {pickText(data.profile.location, locale)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verified KPI Metrics */}
          {data.sections.showMetrics && data.metrics.length > 0 && (
            <div className="mt-12 pt-10 border-t border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {data.metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5"
                >
                  <div className="font-serif-editorial text-3xl font-medium text-[var(--text-primary)]">
                    {metric.value}
                  </div>
                  <div className="text-sm font-semibold text-[var(--text-primary)] mt-1">
                    {pickText(metric.label, locale)}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {pickText(metric.sub, locale)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Published Channels Strip */}
          {data.sections.showChannels && visibleChannels.length > 0 && (
            <div className="mt-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {copy.channelsLabel}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {visibleChannels.map((ch) => (
                  <a
                    key={ch.id}
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--accent)] transition"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[var(--text-muted)] truncate">
                        {ch.label}
                      </p>
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {ch.handle}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] shrink-0 transition" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SELECTED WORK & CASE STUDIES */}
        {data.sections.showCaseStudies && (
          <section
            id="work"
            className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-16 sm:py-20"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  {copy.workEyebrow}
                </p>
                <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-[var(--text-primary)]">
                  {copy.workTitle}
                </h2>
              </div>

              {/* Category Filters — responsive wrap, equal h-9/h-10 heights */}
              <div className="flex flex-wrap gap-2">
                {filterTabs.map((tab) => {
                  const active = category === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategory(tab.id)}
                      className={`h-10 px-4 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                        active
                          ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                          : "border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleCaseStudies.map((cs) => (
                  <article
                    key={cs.id}
                    className="group rounded-2xl border border-[var(--border-color)] bg-[var(--bg-page)] overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-video bg-[var(--bg-subtle)] overflow-hidden border-b border-[var(--border-color)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cs.thumbnail || "/images/port-color-grading.webp"}
                        alt={pickText(cs.title, locale)}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      {cs.youtubeId && (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveVideo({
                              id: cs.youtubeId!,
                              title: pickText(cs.title, locale),
                            })
                          }
                          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-black/80 text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{copy.playPreview}</span>
                        </button>
                      )}
                    </div>

                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                            {pickText(cs.tag, locale)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--success)]">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{pickText(cs.impact, locale)}</span>
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[var(--text-primary)] leading-snug">
                          {pickText(cs.title, locale)}
                        </h3>

                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {pickText(cs.summary, locale)}
                        </p>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
                        {cs.tools.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {cs.tools.map((tool) => (
                              <span
                                key={tool}
                                className="px-2.5 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-color)] text-[11px] font-medium text-[var(--text-secondary)]"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}

                        {(cs.primaryUrl || (cs.extraLinks && cs.extraLinks.length > 0)) && (
                          <div className="flex flex-wrap gap-2">
                            {cs.primaryUrl && (
                              <a
                                href={cs.primaryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold hover:opacity-90 transition"
                              >
                                <span>{copy.openChannel}</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {cs.extraLinks?.map((link) => (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition"
                              >
                                <span>{pickText(link.label, locale)}</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* EXPERIENCE TIMELINE */}
        {data.sections.showExperience && (
          <section
            id="experience"
            className="border-t border-[var(--border-color)] py-16 sm:py-20"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  {copy.expEyebrow}
                </p>
                <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-[var(--text-primary)]">
                  {copy.expTitle}
                </h2>
              </div>

              <div className="divide-y divide-[var(--border-color)] border-y border-[var(--border-color)]">
                {visibleExperiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8"
                  >
                    <div className="md:col-span-4 space-y-1">
                      <p className="font-mono-tech text-xs font-medium text-[var(--accent)]">
                        {pickText(exp.period, locale)}
                      </p>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {exp.organization}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {pickText(exp.type, locale)}
                      </p>
                    </div>
                    <div className="md:col-span-8 space-y-3">
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">
                        {pickText(exp.role, locale)}
                      </h3>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        {pickList(exp.bullets, locale).map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TOOLS & AI WORKFLOW STACK */}
        {data.sections.showTools && (
          <section
            id="tools"
            className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-16 sm:py-20"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  {copy.toolsEyebrow}
                </p>
                <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-[var(--text-primary)]">
                  {copy.toolsTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.toolGroups.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] p-5 space-y-3"
                  >
                    <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <span>{pickText(group.title, locale)}</span>
                    </h3>
                    <ul className="space-y-1.5">
                      {group.items.map((tool) => (
                        <li
                          key={tool}
                          className="text-sm text-[var(--text-secondary)] leading-snug"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* EDUCATION & LANGUAGES */}
        {data.sections.showEducation && (
          <section className="border-t border-[var(--border-color)] py-14 sm:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  {copy.eduEyebrow}
                </p>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[var(--text-primary)]">
                  {copy.eduTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.education
                  .filter((e) => e.visible)
                  .map((edu) => (
                    <div
                      key={edu.id}
                      className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-1.5"
                    >
                      <p className="font-mono-tech text-xs text-[var(--accent)]">{edu.period}</p>
                      <h3 className="text-base font-bold text-[var(--text-primary)]">
                        {pickText(edu.program, locale)}
                      </h3>
                      <p className="text-xs font-medium text-[var(--text-muted)]">
                        {edu.institution}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)] pt-1">
                        {pickText(edu.status, locale)}
                      </p>
                    </div>
                  ))}

                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-3">
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {locale === "en" ? "Languages" : "Bahasa"}
                  </h3>
                  <div className="space-y-2">
                    {data.languages.map((langItem, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 text-sm border-b last:border-b-0 border-[var(--border-color)] pb-2 last:pb-0"
                      >
                        <span className="font-semibold text-[var(--text-primary)]">
                          {pickText(langItem.name, locale)}
                        </span>
                        <span className="text-[var(--text-secondary)] text-xs sm:text-sm">
                          {pickText(langItem.level, locale)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CONTACT & ATS RESUME CTA */}
        <section
          id="contact"
          className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-16 sm:py-20"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl space-y-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                {copy.contactEyebrow}
              </p>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-[var(--text-primary)] leading-tight">
                {copy.contactTitle}
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                {copy.contactDesc}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`mailto:${data.profile.email}`}
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] text-sm font-semibold transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>{data.profile.email}</span>
                </a>
                <a
                  href={data.profile.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] hover:border-[var(--text-muted)] text-[var(--text-primary)] text-sm font-semibold transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{data.profile.whatsappDisplay}</span>
                </a>
                {data.profile.linkedinUrl && (
                  <a
                    href={data.profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] hover:border-[var(--text-muted)] text-[var(--text-primary)] text-sm font-semibold transition"
                  >
                    <span>{copy.linkedin}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                <Link
                  href="/cv"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] hover:border-[var(--accent)] text-[var(--text-primary)] text-sm font-semibold transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>{copy.atsAction}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-[var(--border-color)] py-6 px-4 sm:px-6 text-xs text-[var(--text-muted)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text-primary)]">
              {data.profile.fullName}
            </span>
            <span>•</span>
            <span>{pickText(data.profile.location, locale)}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/cv" className="hover:text-[var(--text-primary)] transition">
              ATS Resume (PDF)
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 hover:text-[var(--text-primary)] transition"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{copy.adminLink}</span>
            </Link>
          </div>
        </div>
      </footer>

      <VideoModal
        youtubeId={activeVideo?.id || null}
        title={activeVideo?.title || "Video Preview"}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
}
