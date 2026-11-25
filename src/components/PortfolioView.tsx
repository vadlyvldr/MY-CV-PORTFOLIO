"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Globe,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Play,
  Settings,
  X,
} from "lucide-react";
import {
  CaseStudyCategory,
  CaseStudyItem,
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
    navCv: "ATS Resume",
    downloadCv: "ATS Resume (PDF)",
    contactMe: "Start a Project",
    whatsApp: "WhatsApp",
    channelsLabel: "Verified Channels",
    workTitle: "Selected Work &",
    workTitleItalic: "Production",
    filterAll: "All Works",
    filterShort: "Short-Form",
    filterYoutube: "YouTube & Live",
    filterAudio: "Audio & Photo",
    filterAi: "AI & Web Apps",
    playPreview: "Play Video",
    openChannel: "Open Source",
    expTitle: "Experience &",
    expTitleItalic: "Track Record",
    toolsTitle: "Production Tools &",
    toolsTitleItalic: "AI Stack",
    langTitle: "Languages &",
    langTitleItalic: "Availability",
    contactTitle: "Open for creative roles,",
    contactTitleItalic: "remote & EU teams",
    contactDesc:
      "Ready to contribute across short-form video growth, YouTube production, studio audio mixing, and AI-accelerated content operations.",
    linkedin: "LinkedIn",
    atsAction: "Open Printable ATS CV",
    adminLink: "Manage via Admin",
    draftNotice: "Previewing unpublished browser draft from /admin.",
    draftClear: "Exit Draft Preview",
  },
  id: {
    navWork: "Karya",
    navExp: "Pengalaman",
    navTools: "Tools & AI",
    navContact: "Kontak",
    navCv: "CV ATS",
    downloadCv: "CV ATS (PDF)",
    contactMe: "Hubungi Saya",
    whatsApp: "WhatsApp",
    channelsLabel: "Kanal Terverifikasi",
    workTitle: "Karya Terpilih &",
    workTitleItalic: "Produksi",
    filterAll: "Semua",
    filterShort: "Short-Form",
    filterYoutube: "YouTube & Live",
    filterAudio: "Audio & Foto",
    filterAi: "AI & Web App",
    playPreview: "Putar Video",
    openChannel: "Buka Tautan",
    expTitle: "Pengalaman &",
    expTitleItalic: "Rekam Jejak",
    toolsTitle: "Software Produksi &",
    toolsTitleItalic: "Ekosistem AI",
    langTitle: "Bahasa &",
    langTitleItalic: "Ketersediaan",
    contactTitle: "Terbuka untuk peran kreatif,",
    contactTitleItalic: "tim remote & Eropa",
    contactDesc:
      "Siap berkontribusi di pertumbuhan konten video pendek, produksi YouTube, mixing audio studio, dan alur kerja konten berbasis AI.",
    linkedin: "LinkedIn",
    atsAction: "Buka CV Cetak (PDF)",
    adminLink: "Kelola via Admin",
    draftNotice: "Sedang mempratinjau draf lokal dari /admin (belum dipublish).",
    draftClear: "Keluar Pratinjau",
  },
} as const;

const DISCIPLINE_MARQUEE = [
  "Short-Form Retention",
  "YouTube Production",
  "Multi-Track Audio",
  "Live Broadcasting",
  "ElevenLabs AI Voice",
  "Agentic Web Workflows",
  "Commercial Photography",
];

function CaseStudyCard({
  cs,
  index,
  locale,
  copy,
  onPlayVideo,
}: {
  cs: CaseStudyItem;
  index: number;
  locale: Locale;
  copy: (typeof UI_COPY)["en"] | (typeof UI_COPY)["id"];
  onPlayVideo: (id: string, title: string) => void;
}) {
  const hasRealMedia = Boolean(cs.thumbnail);
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <article className="group rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden flex flex-col justify-between transition hover:border-[var(--accent)]">
      {hasRealMedia ? (
        <div className="relative aspect-video bg-[var(--bg-panel)] overflow-hidden border-b border-[var(--border-color)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cs.thumbnail}
            alt={pickText(cs.title, locale)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {cs.youtubeId && (
            <button
              type="button"
              onClick={() => onPlayVideo(cs.youtubeId!, pickText(cs.title, locale))}
              className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-black/85 text-white text-xs font-semibold hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{copy.playPreview}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3.5 flex items-center justify-between gap-4 border-b border-[var(--border-color)]/60 bg-[var(--bg-panel)]/45">
          <div className="inline-flex items-baseline gap-2.5">
            <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--accent)] tabular-nums">
              {indexLabel}
            </span>
            {cs.reelMeta?.ratioLabel && (
              <span className="px-2 py-0.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                {cs.reelMeta.ratioLabel}
              </span>
            )}
          </div>
          <span className="font-mono-tech text-[11px] font-medium text-[var(--text-muted)] text-right truncate">
            {cs.reelMeta?.handle || pickText(cs.impact, locale)}
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-[var(--accent)]">
              {pickText(cs.tag, locale)}
            </span>
            <span className="font-mono-tech text-[11px] font-medium text-[var(--success)]">
              {pickText(cs.impact, locale)}
            </span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug">
            {pickText(cs.title, locale)}
          </h3>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {pickText(cs.summary, locale)}
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
          {cs.tools.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cs.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-md bg-[var(--bg-page)] border border-[var(--border-color)] text-[11px] font-medium text-[var(--text-secondary)]"
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
                  className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold hover:opacity-85 transition"
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
                  className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition"
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
  );
}

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

  const filterTabs: { id: "all" | CaseStudyCategory; label: string; count: number }[] = useMemo(() => {
    const active = data.caseStudies.filter((i) => i.visible);
    return [
      { id: "all", label: copy.filterAll, count: active.length },
      {
        id: "short-form",
        label: copy.filterShort,
        count: active.filter((i) => i.category === "short-form").length,
      },
      {
        id: "youtube",
        label: copy.filterYoutube,
        count: active.filter((i) => i.category === "youtube").length,
      },
      {
        id: "audio-photo",
        label: copy.filterAudio,
        count: active.filter((i) => i.category === "audio-photo").length,
      },
      {
        id: "ai-workflow",
        label: copy.filterAi,
        count: active.filter((i) => i.category === "ai-workflow").length,
      },
    ];
  }, [data.caseStudies, copy]);

  const clearDraftPreview = () => {
    window.history.replaceState({}, "", "/");
    notifyDraftUpdated();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isDraftPreview && (
        <div className="bg-[var(--accent)] text-[var(--accent-ink)] px-4 py-2 text-xs font-semibold flex flex-wrap items-center justify-center gap-3">
          <span>{copy.draftNotice}</span>
          <button type="button" onClick={clearDraftPreview} className="underline cursor-pointer">
            {copy.draftClear}
          </button>
        </div>
      )}

      {/* Editorial Studio Navigation */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-page)]/92 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-baseline gap-2 shrink-0 text-[var(--text-primary)]"
          >
            <span className="font-display text-2xl font-extrabold tracking-tight">
              {data.profile.nickname}
            </span>
            <span className="hidden sm:inline font-serif-accent italic text-base text-[var(--text-muted)]">
              Studio
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--text-secondary)]"
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
        {/* BALANCED DIRECTOR HERO */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] shrink-0" />
                <span>{pickText(data.profile.availabilityBadge, locale)}</span>
              </div>

              <div className="space-y-2.5">
                <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-[-0.03em] leading-[0.98] text-[var(--text-primary)]">
                  {data.profile.nickname}{" "}
                  <span className="block font-serif-accent italic font-normal text-2xl sm:text-3xl lg:text-4xl text-[var(--accent)] mt-2 tracking-normal">
                    {data.profile.fullName}
                  </span>
                </h1>
                <p className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] pt-1">
                  {pickText(data.profile.headline, locale)}
                </p>
              </div>

              <p className="text-[15.5px] sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                {pickText(data.profile.bio, locale)}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{pickText(data.profile.location, locale)}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{pickText(data.profile.targetLocation, locale)}</span>
                </span>
              </div>

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
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-primary)] text-[var(--text-primary)] text-sm font-semibold transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>{copy.contactMe}</span>
                </a>
                <a
                  href={data.profile.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-primary)] text-[var(--text-primary)] text-sm font-semibold transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{copy.whatsApp}</span>
                </a>
              </div>

              {data.sections.showMetrics && data.metrics.length > 0 && (
                <div className="pt-6 border-t border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                  {data.metrics.map((metric) => (
                    <div key={metric.id} className="space-y-0.5">
                      <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] tabular-nums">
                        {metric.value}
                      </div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">
                        {pickText(metric.label, locale)}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {pickText(metric.sub, locale)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clean Studio Portrait — No tiny/awkward caption bar underneath */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="w-full max-w-[300px] sm:max-w-[370px] aspect-[4/5] rounded-2xl overflow-hidden bg-[#0b0b0d] border border-[var(--border-color)] shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.profile.avatarUrl || "/images/profile-main.png"}
                  alt={data.profile.fullName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {data.sections.showChannels && visibleChannels.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
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
                      <p className="text-[11px] font-medium text-[var(--text-muted)] truncate">
                        {ch.label}
                      </p>
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">
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

        {/* Calm Discipline Strip */}
        <div className="border-y border-[var(--border-color)] bg-[var(--bg-surface)] py-3 overflow-hidden">
          <div className="flex gap-10 w-max animate-marquee-slow">
            {[...DISCIPLINE_MARQUEE, ...DISCIPLINE_MARQUEE].map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-3 text-xs font-semibold tracking-wide text-[var(--text-secondary)] whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>

        {/* SELECTED WORK & CASE STUDIES */}
        {data.sections.showCaseStudies && (
          <section id="work" className="py-16 sm:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="space-y-6">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.025em] text-[var(--text-primary)]">
                  {copy.workTitle}{" "}
                  <span className="font-serif-accent italic font-normal text-[var(--accent)]">
                    {copy.workTitleItalic}
                  </span>
                </h2>

                <div
                  role="tablist"
                  aria-label="Work categories"
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[var(--border-color)]"
                >
                  {filterTabs.map((tab) => {
                    const active = category === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setCategory(tab.id)}
                        className={`relative pb-3 text-[13px] sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer inline-flex items-center gap-1.5 ${
                          active
                            ? "text-[var(--text-primary)] border-b-2 border-[var(--accent)] -mb-px"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className="font-mono-tech text-[11px] opacity-75">
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {visibleCaseStudies.map((cs, idx) => (
                  <CaseStudyCard
                    key={cs.id}
                    cs={cs}
                    index={idx}
                    locale={locale}
                    copy={copy}
                    onPlayVideo={(id, title) => setActiveVideo({ id, title })}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* EXPERIENCE LEDGER */}
        {data.sections.showExperience && (
          <section
            id="experience"
            className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-16 sm:py-24"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.025em] text-[var(--text-primary)]">
                {copy.expTitle}{" "}
                <span className="font-serif-accent italic font-normal text-[var(--accent)]">
                  {copy.expTitleItalic}
                </span>
              </h2>

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
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        {exp.organization}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {pickText(exp.type, locale)}
                      </p>
                    </div>
                    <div className="md:col-span-8 space-y-2.5">
                      <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
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

        {/* TOOLS MATRIX & LANGUAGES */}
        {data.sections.showTools && (
          <section id="tools" className="border-t border-[var(--border-color)] py-16 sm:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
              <div className="space-y-8">
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-[-0.025em] text-[var(--text-primary)]">
                  {copy.toolsTitle}{" "}
                  <span className="font-serif-accent italic font-normal text-[var(--accent)]">
                    {copy.toolsTitleItalic}
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[var(--border-color)]">
                  {data.toolGroups.map((group, idx) => (
                    <div
                      key={group.id}
                      className="border-r border-b border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3"
                    >
                      <span className="font-mono-tech text-[11px] text-[var(--accent)] font-semibold block">
                        0{idx + 1}
                      </span>
                      <h3 className="font-display text-sm font-bold text-[var(--text-primary)]">
                        {pickText(group.title, locale)}
                      </h3>
                      <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                        {group.items.map((tool) => (
                          <li key={tool}>{tool}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-color)] grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5">
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
                    {copy.langTitle}{" "}
                    <span className="font-serif-accent italic font-normal text-[var(--accent)]">
                      {copy.langTitleItalic}
                    </span>
                  </h2>
                </div>
                <div className="md:col-span-7 divide-y divide-[var(--border-color)] border-y border-[var(--border-color)]">
                  {data.languages.map((langItem, idx) => (
                    <div
                      key={idx}
                      className="py-3.5 flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="font-semibold text-[var(--text-primary)]">
                        {pickText(langItem.name, locale)}
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {pickText(langItem.level, locale)}
                      </span>
                    </div>
                  ))}
                  <div className="py-3.5 flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {locale === "en" ? "Working Overlap" : "Zona Waktu Kerja"}
                    </span>
                    <span className="text-[var(--text-secondary)]">
                      UTC+7 • {pickText(data.profile.targetLocation, locale)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CONTACT CLOSE */}
        <section
          id="contact"
          className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-16 sm:py-24"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-5">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-[var(--text-primary)] leading-[1.08]">
                {copy.contactTitle}{" "}
                <span className="font-serif-accent italic font-normal text-[var(--accent)]">
                  {copy.contactTitleItalic}
                </span>
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
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] hover:border-[var(--text-primary)] text-[var(--text-primary)] text-sm font-semibold transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{data.profile.whatsappDisplay}</span>
                </a>
                {data.profile.linkedinUrl && (
                  <a
                    href={data.profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] hover:border-[var(--text-primary)] text-[var(--text-primary)] text-sm font-semibold transition"
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

      <footer className="border-t border-[var(--border-color)] py-6 px-4 sm:px-6 lg:px-8 text-xs text-[var(--text-muted)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text-primary)]">
              {data.profile.fullName}
            </span>
            <span>•</span>
            <span>{pickText(data.profile.location, locale)}</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/cv" className="hover:text-[var(--text-primary)] transition">
              {copy.navCv}
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
