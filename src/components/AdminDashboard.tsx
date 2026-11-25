"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import {
  CaseStudyCategory,
  CaseStudyItem,
  CvProfileData,
  ExperienceItem,
} from "@/types/cv";
import { DRAFT_STORAGE_KEY, extractYouTubeId } from "@/lib/cv-data";
import { notifyDraftUpdated, useCvDraftPreview } from "@/lib/use-cv-draft";
import { ThemeLangControls, usePreferences } from "./ThemeLangControls";

interface AdminDashboardProps {
  initialData: CvProfileData;
}

interface SessionInfo {
  authenticated: boolean;
  githubConfigured: boolean;
  repo: string;
  branch: string;
  devMode: boolean;
  needsPinSetup: boolean;
}

type AdminTab = "profile" | "work" | "experience" | "tools" | "publish";

export function AdminDashboard({ initialData }: AdminDashboardProps) {
  const { locale, setLocale, theme, toggleTheme } = usePreferences();
  const { hasLocalDraft, localDraftData } = useCvDraftPreview(initialData);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [pin, setPin] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [tab, setTab] = useState<AdminTab>("profile");
  const [draft, setDraft] = useState<CvProfileData>(initialData);
  const [stagedUpload, setStagedUpload] = useState<{
    fileName: string;
    base64Content: string;
  } | null>(null);
  const [commitMessage, setCommitMessage] = useState("chore(cv): update content via /admin");
  const [statusMsg, setStatusMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((res: SessionInfo) => setSession(res))
      .catch(() =>
        setSession({
          authenticated: false,
          githubConfigured: false,
          repo: "vadlyvldr/MY-CV-PORTFOLIO",
          branch: "main",
          devMode: false,
          needsPinSetup: false,
        })
      );
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setAuthError(json.error || "Login failed.");
      } else {
        const nextSess = await fetch("/api/admin/session").then((r) => r.json());
        setSession(nextSess as SessionInfo);
        setPin("");
      }
    } catch {
      setAuthError("Network error while verifying PIN.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setSession((s) => (s ? { ...s, authenticated: false } : null));
  };

  const saveLocalDraft = () => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      notifyDraftUpdated();
      setStatusMsg({
        type: "ok",
        text: "Draft saved to this browser. Click Preview Site / Preview ATS CV below to inspect before publishing.",
      });
    } catch {
      setStatusMsg({ type: "err", text: "Failed to save draft in localStorage." });
    }
  };

  const resetToCommitted = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    notifyDraftUpdated();
    setDraft(initialData);
    setStagedUpload(null);
    setStatusMsg({ type: "ok", text: "Reset form to committed cv-data.json version." });
  };

  const downloadJson = () => {
    const blob = new Blob([`${JSON.stringify(draft, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePhotoFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setStagedUpload({ fileName: file.name, base64Content: reader.result });
        setDraft((prev) => ({
          ...prev,
          profile: { ...prev.profile, avatarUrl: reader.result as string },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    setBusy(true);
    setStatusMsg(null);
    try {
      const cleanDraft: CvProfileData = {
        ...draft,
        profile: {
          ...draft.profile,
          avatarUrl: stagedUpload ? initialData.profile.avatarUrl : draft.profile.avatarUrl,
        },
      };
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvData: cleanDraft,
          assetUpload: stagedUpload || undefined,
          commitMessage,
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
        data?: CvProfileData;
        commitUrl?: string;
      };
      if (!res.ok || !json.ok) {
        setStatusMsg({ type: "err", text: json.error || "Failed to publish." });
      } else {
        if (json.data) setDraft(json.data);
        setStagedUpload(null);
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        notifyDraftUpdated();
        setStatusMsg({
          type: "ok",
          text: json.message || "Published cleanly.",
        });
      }
    } catch {
      setStatusMsg({ type: "err", text: "Network error during publish." });
    } finally {
      setBusy(false);
    }
  };

  const moveItem = <T,>(arr: T[], idx: number, dir: -1 | 1): T[] => {
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return arr;
    const copy = [...arr];
    const [picked] = copy.splice(idx, 1);
    copy.splice(target, 0, picked);
    return copy;
  };

  const addCaseStudy = () => {
    const newItem: CaseStudyItem = {
      id: `cs-${Date.now()}`,
      category: "ai-workflow",
      visible: true,
      featured: false,
      tag: { en: "New Project", id: "Proyek Baru" },
      title: { en: "Untitled Case Study", id: "Studi Kasus Baru" },
      summary: { en: "Describe your process and result.", id: "Jelaskan proses & hasilnya." },
      impact: { en: "Measurable impact", id: "Hasil terukur" },
      thumbnail: "/images/port-audio-podcast.jpg",
      youtubeId: "",
      primaryUrl: "",
      extraLinks: [],
      tools: ["Adobe Premiere Pro"],
    };
    setDraft((prev) => ({ ...prev, caseStudies: [newItem, ...prev.caseStudies] }));
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      visible: true,
      period: { en: "2026 – Present", id: "2026 – Sekarang" },
      role: { en: "New Role", id: "Peran Baru" },
      organization: "Company / Client",
      type: { en: "Full-Time / Freelance", id: "Penuh Waktu / Freelance" },
      bullets: {
        en: ["Key achievement or measurable output."],
        id: ["Pencapaian utama atau hasil terukur."],
      },
    };
    setDraft((prev) => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-sm text-[var(--text-muted)]">Checking admin session...</p>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-page)]">
        <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </Link>
            <ThemeLangControls
              locale={locale}
              onChangeLocale={setLocale}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-serif-editorial text-2xl font-medium text-[var(--text-primary)]">
              Portfolio Admin
            </h1>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Edit copy, add YouTube/TikTok links, swap photos, toggle visibility of roles before
              exporting CV, and publish straight to GitHub.
            </p>
          </div>

          {session.needsPinSetup && (
            <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-300">
              Set <code>ADMIN_PIN</code> in your Vercel Project Environment Variables before logging
              in on production.
            </div>
          )}

          {session.devMode && (
            <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)]">
              Local dev mode active: if <code>ADMIN_PIN</code> is unset, default dev PIN is{" "}
              <code className="font-mono-tech font-bold">159357</code>.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)] block">
                Admin PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter admin PIN"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {authError && <p className="text-xs font-medium text-red-500">{authError}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] text-sm font-semibold transition cursor-pointer disabled:opacity-60"
            >
              {busy ? "Verifying..." : "Unlock Admin Editor"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "profile", label: "Profile & Photo" },
    { id: "work", label: "Work & Videos" },
    { id: "experience", label: "Experience" },
    { id: "tools", label: "Tools & Channels" },
    { id: "publish", label: "Preview & Publish" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] pb-16">
      <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-page)]/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-primary)] shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Site</span>
            </Link>
            <span className="font-bold text-sm text-[var(--text-primary)] truncate">
              CV Editor ({session.repo})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeLangControls
              locale={locale}
              onChangeLocale={setLocale}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Quick Status + Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`h-10 px-4 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  tab === t.id
                    ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                    : "border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveLocalDraft}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <Link
              href="/?preview=draft"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)]"
            >
              <span>Preview Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {hasLocalDraft && localDraftData && (
          <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs flex flex-wrap items-center justify-between gap-2">
            <span className="text-[var(--text-secondary)]">
              Saved browser draft available (updated {localDraftData.updatedAt}).
            </span>
            <button
              type="button"
              onClick={() => {
                setDraft(localDraftData);
                setStatusMsg({ type: "ok", text: "Loaded saved browser draft into editor." });
              }}
              className="h-8 px-3 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] font-semibold cursor-pointer"
            >
              Load Saved Draft
            </button>
          </div>
        )}

        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              statusMsg.type === "ok"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* TAB 1: PROFILE & PHOTO */}
        {tab === "profile" && (
          <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              Identity, Headlines & Contacts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1 text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Full Name</span>
                <input
                  value={draft.profile.fullName}
                  onChange={(e) =>
                    setDraft({ ...draft, profile: { ...draft.profile, fullName: e.target.value } })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Nickname</span>
                <input
                  value={draft.profile.nickname}
                  onChange={(e) =>
                    setDraft({ ...draft, profile: { ...draft.profile, nickname: e.target.value } })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Headline (EN)</span>
                <input
                  value={draft.profile.headline.en}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: {
                        ...draft.profile,
                        headline: { ...draft.profile.headline, en: e.target.value },
                      },
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Headline (ID)</span>
                <input
                  value={draft.profile.headline.id}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: {
                        ...draft.profile,
                        headline: { ...draft.profile.headline, id: e.target.value },
                      },
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Availability Badge (EN)</span>
                <input
                  value={draft.profile.availabilityBadge.en}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: {
                        ...draft.profile,
                        availabilityBadge: {
                          ...draft.profile.availabilityBadge,
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">LinkedIn Profile URL</span>
                <input
                  value={draft.profile.linkedinUrl}
                  placeholder="https://www.linkedin.com/in/..."
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: { ...draft.profile, linkedinUrl: e.target.value },
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Email</span>
                <input
                  value={draft.profile.email}
                  onChange={(e) =>
                    setDraft({ ...draft, profile: { ...draft.profile, email: e.target.value } })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">WhatsApp URL</span>
                <input
                  value={draft.profile.whatsappUrl}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: { ...draft.profile, whatsappUrl: e.target.value },
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1 text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Bio / Summary (EN)</span>
                <textarea
                  rows={4}
                  value={draft.profile.bio.en}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: { ...draft.profile, bio: { ...draft.profile.bio, en: e.target.value } },
                    })
                  }
                  className="w-full p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Bio / Summary (ID)</span>
                <textarea
                  rows={4}
                  value={draft.profile.bio.id}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: { ...draft.profile, bio: { ...draft.profile.bio, id: e.target.value } },
                    })
                  }
                  className="w-full p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                />
              </label>
            </div>

            {/* Profile Photo Picker */}
            <div className="pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draft.profile.avatarUrl}
                alt="Portrait preview"
                className="w-20 h-24 object-cover rounded-xl border border-[var(--border-color)] shrink-0"
              />
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  Update Portrait Photo
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Upload a crisp headshot — gets pushed to <code>public/images/</code> when you
                  click Publish.
                </p>
                <label className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-xs font-semibold cursor-pointer hover:border-[var(--accent)]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{stagedUpload ? `Ready: ${stagedUpload.fileName}` : "Choose Image File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoFile(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: CASE STUDIES */}
        {tab === "work" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Portfolio Case Studies ({draft.caseStudies.length})
              </h2>
              <button
                type="button"
                onClick={addCaseStudy}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {draft.caseStudies.map((cs, idx) => (
              <div
                key={cs.id}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-color)]">
                  <strong className="text-sm text-[var(--text-primary)]">
                    #{idx + 1} {cs.title.en}
                  </strong>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          caseStudies: draft.caseStudies.map((item, i) =>
                            i === idx ? { ...item, visible: !item.visible } : item
                          ),
                        })
                      }
                      className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-[var(--border-color)] text-xs font-medium cursor-pointer"
                    >
                      {cs.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{cs.visible ? "Shown" : "Hidden"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({ ...draft, caseStudies: moveItem(draft.caseStudies, idx, -1) })
                      }
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-[var(--border-color)] cursor-pointer"
                      aria-label="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({ ...draft, caseStudies: moveItem(draft.caseStudies, idx, 1) })
                      }
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-[var(--border-color)] cursor-pointer"
                      aria-label="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          caseStudies: draft.caseStudies.filter((_, i) => i !== idx),
                        })
                      }
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-red-500/30 text-red-500 cursor-pointer"
                      aria-label="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Title (EN)</span>
                    <input
                      value={cs.title.en}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          caseStudies: draft.caseStudies.map((item, i) =>
                            i === idx ? { ...item, title: { ...item.title, en: e.target.value } } : item
                          ),
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Title (ID)</span>
                    <input
                      value={cs.title.id}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          caseStudies: draft.caseStudies.map((item, i) =>
                            i === idx ? { ...item, title: { ...item.title, id: e.target.value } } : item
                          ),
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Category</span>
                    <select
                      value={cs.category}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          caseStudies: draft.caseStudies.map((item, i) =>
                            i === idx
                              ? { ...item, category: e.target.value as CaseStudyCategory }
                              : item
                          ),
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    >
                      <option value="short-form">Short-Form & Social</option>
                      <option value="youtube">YouTube & Live</option>
                      <option value="audio-photo">Audio & Photo</option>
                      <option value="ai-workflow">AI Workflows</option>
                    </select>
                  </label>

                  <label className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">
                      YouTube URL or Video ID (optional)
                    </span>
                    <input
                      value={cs.youtubeId || ""}
                      placeholder="https://www.youtube.com/watch?v=..."
                      onChange={(e) => {
                        const raw = e.target.value;
                        const extracted = extractYouTubeId(raw);
                        setDraft({
                          ...draft,
                          caseStudies: draft.caseStudies.map((item, i) =>
                            i === idx ? { ...item, youtubeId: extracted || raw } : item
                          ),
                        });
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Primary URL</span>
                    <input
                      value={cs.primaryUrl || ""}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          caseStudies: draft.caseStudies.map((item, i) =>
                            i === idx ? { ...item, primaryUrl: e.target.value } : item
                          ),
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Tools (comma-separated)</span>
                    <input
                      value={cs.tools.join(", ")}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          caseStudies: draft.caseStudies.map((item, i) =>
                            i === idx
                              ? {
                                  ...item,
                                  tools: e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                }
                              : item
                          ),
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs font-semibold sm:col-span-2">
                    <span className="text-[var(--text-secondary)]">Summary (EN)</span>
                    <textarea
                      rows={2}
                      value={cs.summary.en}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          caseStudies: draft.caseStudies.map((item, i) =>
                            i === idx
                              ? { ...item, summary: { ...item.summary, en: e.target.value } }
                              : item
                          ),
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* TAB 3: EXPERIENCE */}
        {tab === "experience" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  Experience Timeline ({draft.experiences.length})
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Hide or show roles anytime (also hides them from the Printable ATS CV).
                </p>
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Role</span>
              </button>
            </div>

            {draft.experiences.map((exp, idx) => (
              <div
                key={exp.id}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-color)]">
                  <strong className="text-sm text-[var(--text-primary)]">
                    {exp.role.en} — {exp.organization}
                  </strong>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          experiences: draft.experiences.map((item, i) =>
                            i === idx ? { ...item, visible: !item.visible } : item
                          ),
                        })
                      }
                      className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-[var(--border-color)] text-xs font-medium cursor-pointer"
                    >
                      {exp.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{exp.visible ? "Shown" : "Hidden"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({ ...draft, experiences: moveItem(draft.experiences, idx, -1) })
                      }
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-[var(--border-color)] cursor-pointer"
                      aria-label="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({ ...draft, experiences: moveItem(draft.experiences, idx, 1) })
                      }
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-[var(--border-color)] cursor-pointer"
                      aria-label="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          experiences: draft.experiences.filter((_, i) => i !== idx),
                        })
                      }
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-red-500/30 text-red-500 cursor-pointer"
                      aria-label="Delete role"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Role (EN)</span>
                    <input
                      value={exp.role.en}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          experiences: draft.experiences.map((item, i) =>
                            i === idx ? { ...item, role: { ...item.role, en: e.target.value } } : item
                          ),
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>
                  <label className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Organization</span>
                    <input
                      value={exp.organization}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          experiences: draft.experiences.map((item, i) =>
                            i === idx ? { ...item, organization: e.target.value } : item
                          ),
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>
                  <label className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Period (EN)</span>
                    <input
                      value={exp.period.en}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          experiences: draft.experiences.map((item, i) =>
                            i === idx
                              ? { ...item, period: { ...item.period, en: e.target.value } }
                              : item
                          ),
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Bullets EN (1 per line)</span>
                    <textarea
                      rows={3}
                      value={exp.bullets.en.join("\n")}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          experiences: draft.experiences.map((item, i) =>
                            i === idx
                              ? {
                                  ...item,
                                  bullets: {
                                    ...item.bullets,
                                    en: e.target.value.split("\n").filter((l) => l.trim().length > 0),
                                  },
                                }
                              : item
                          ),
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>
                  <label className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Bullets ID (1 per line)</span>
                    <textarea
                      rows={3}
                      value={exp.bullets.id.join("\n")}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          experiences: draft.experiences.map((item, i) =>
                            i === idx
                              ? {
                                  ...item,
                                  bullets: {
                                    ...item.bullets,
                                    id: e.target.value.split("\n").filter((l) => l.trim().length > 0),
                                  },
                                }
                              : item
                          ),
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* TAB 4: TOOLS & CHANNELS */}
        {tab === "tools" && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4">
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Published Channels
              </h2>
              <div className="space-y-3">
                {draft.channels.map((ch, idx) => (
                  <div
                    key={ch.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center border-b border-[var(--border-color)] pb-3 last:border-b-0 last:pb-0"
                  >
                    <input
                      value={ch.label}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          channels: draft.channels.map((c, i) =>
                            i === idx ? { ...c, label: e.target.value } : c
                          ),
                        })
                      }
                      className="sm:col-span-4 h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                    <input
                      value={ch.handle}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          channels: draft.channels.map((c, i) =>
                            i === idx ? { ...c, handle: e.target.value } : c
                          ),
                        })
                      }
                      className="sm:col-span-3 h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                    <input
                      value={ch.url}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          channels: draft.channels.map((c, i) =>
                            i === idx ? { ...c, url: e.target.value } : c
                          ),
                        })
                      }
                      className="sm:col-span-4 h-9 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          channels: draft.channels.map((c, i) =>
                            i === idx ? { ...c, visible: !c.visible } : c
                          ),
                        })
                      }
                      className="sm:col-span-1 h-9 px-2 rounded-lg border border-[var(--border-color)] text-xs font-medium cursor-pointer"
                    >
                      {ch.visible ? "On" : "Off"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4">
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Tool & AI Stack Categories (Comma-Separated)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {draft.toolGroups.map((tg, idx) => (
                  <label key={tg.id} className="space-y-1 text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">{tg.title.en}</span>
                    <textarea
                      rows={3}
                      value={tg.items.join(", ")}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          toolGroups: draft.toolGroups.map((group, i) =>
                            i === idx
                              ? {
                                  ...group,
                                  items: e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                }
                              : group
                          ),
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
                    />
                  </label>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: PREVIEW & PUBLISH */}
        {tab === "publish" && (
          <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Publish Updates Live
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Target Repository: <code>{session.repo}</code> ({session.branch}) —{" "}
                {session.githubConfigured
                  ? "GitHub Auto-Publish Connected."
                  : session.devMode
                    ? "Local Dev Mode (writes directly to src/data/cv-data.json)."
                    : "GitHub Token not set yet on server (use Download JSON or set GITHUB_TOKEN in Vercel)."}
              </p>
            </div>

            <label className="space-y-1 text-xs font-semibold block">
              <span className="text-[var(--text-secondary)]">Commit Summary Message</span>
              <input
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-sm"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={handlePublish}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{busy ? "Publishing..." : "Save & Publish Live"}</span>
              </button>

              <Link
                href="/cv?preview=draft"
                onClick={saveLocalDraft}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-sm font-semibold text-[var(--text-primary)]"
              >
                <span>Preview ATS Resume PDF</span>
                <ExternalLink className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={downloadJson}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-sm font-semibold text-[var(--text-primary)] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download cv-data.json</span>
              </button>

              <button
                type="button"
                onClick={resetToCommitted}
                className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <span>Reset Draft</span>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
