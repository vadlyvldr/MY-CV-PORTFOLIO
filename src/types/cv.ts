export type Locale = "en" | "id";
export type ThemeMode = "light" | "dark";

export interface LocalizedText {
  en: string;
  id: string;
}

export interface LocalizedList {
  en: string[];
  id: string[];
}

export interface MetricItem {
  id: string;
  value: string;
  label: LocalizedText;
  sub: LocalizedText;
}

export interface ChannelLink {
  id: string;
  platform: "tiktok" | "instagram" | "youtube" | "linkedin" | "website";
  label: string;
  handle: string;
  url: string;
  visible: boolean;
}

export type CaseStudyCategory = "short-form" | "youtube" | "audio-photo" | "ai-workflow";
export type CaseStudyVisualVariant = "image" | "reel-frame" | "ai-pipeline";

export interface ReelVisualMeta {
  handle: string;
  hookCue: LocalizedText;
  durationLabel: string;
  ratioLabel: string;
  aspectNote: LocalizedText;
}

export interface CaseStudyLink {
  label: LocalizedText;
  url: string;
}

export interface CaseStudyItem {
  id: string;
  category: CaseStudyCategory;
  visualVariant?: CaseStudyVisualVariant;
  reelMeta?: ReelVisualMeta;
  visible: boolean;
  featured: boolean;
  tag: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  impact: LocalizedText;
  thumbnail: string;
  youtubeId?: string;
  tiktokId?: string;
  primaryUrl?: string;
  extraLinks?: CaseStudyLink[];
  tools: string[];
}

export interface ExperienceItem {
  id: string;
  visible: boolean;
  period: LocalizedText;
  role: LocalizedText;
  organization: string;
  type: LocalizedText;
  bullets: LocalizedList;
}

export interface ToolCategory {
  id: string;
  title: LocalizedText;
  items: string[];
}

export interface EducationItem {
  id: string;
  visible: boolean;
  period: string;
  program: LocalizedText;
  institution: string;
  status: LocalizedText;
}

export interface LanguageItem {
  name: LocalizedText;
  level: LocalizedText;
}

export interface CvSectionsVisibility {
  showChannels: boolean;
  showMetrics: boolean;
  showCaseStudies: boolean;
  showExperience: boolean;
  showTools: boolean;
  showEducation: boolean;
}

export interface CvProfileData {
  version: string;
  updatedAt: string;
  profile: {
    fullName: string;
    nickname: string;
    headline: LocalizedText;
    availabilityBadge: LocalizedText;
    location: LocalizedText;
    bio: LocalizedText;
    targetLocation: LocalizedText;
    avatarUrl: string;
    email: string;
    whatsappUrl: string;
    whatsappDisplay: string;
    linkedinUrl: string;
    websiteUrl: string;
  };
  sections: CvSectionsVisibility;
  metrics: MetricItem[];
  channels: ChannelLink[];
  caseStudies: CaseStudyItem[];
  experiences: ExperienceItem[];
  toolGroups: ToolCategory[];
  education: EducationItem[];
  languages: LanguageItem[];
}

export function pickText(value: LocalizedText | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale] || value.en || value.id || "";
}

export function pickList(value: LocalizedList | undefined, locale: Locale): string[] {
  if (!value) return [];
  const list = value[locale];
  if (Array.isArray(list) && list.length > 0) return list;
  return value.en || value.id || [];
}
