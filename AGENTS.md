# vadlycv-v2 — Agent & Maintainer Guide

Clean, bilingual (`en` default + `id` switch), Light/Dark editorial portfolio + ATS Resume (`/cv`) + Zero-Coding CMS (`/admin`) for **Muhammad Ryan Fadliansyah (Fadli)**.

## Folder Map
- `src/data/cv-data.json` — **Single Source of Truth.** Every bio, metric, YouTube/TikTok link, case study, experience bullet, tool stack, and education item lives here in `{ en, id }` shape.
- `src/types/cv.ts` — TypeScript schema (`CvProfileData`) and `pickText` / `pickList` localization helpers.
- `src/lib/cv-data.ts` — JSON loader, payload validator (`validateCvData`), and YouTube URL/ID extractor (`extractYouTubeId`).
- `src/lib/admin-auth.ts` — Server-side PIN check & HMAC-SHA256 stateless HTTPOnly cookie auth.
- `src/components/PortfolioView.tsx` — Main portfolio UI (`/`) with Light Editorial default + Dark mode switch, EN default + ID toggle, category filter, and YouTube modal preview.
- `src/components/AtsResumeView.tsx` — Print-optimized EU/ATS single-column CV (`/cv`) with `@media print` A4 rules.
- `src/components/AdminDashboard.tsx` — Zero-coding editor (`/admin`) supporting browser draft preview (`?preview=draft`), JSON export, portrait upload, and 1-click GitHub commit via `/api/admin/publish`.
- `public/images/` — Local portfolio photos & thumbnails.

## How Future Agents Should Make Edits
1. **Copy/Link/Role updates:** Edit `src/data/cv-data.json` directly (preserve valid `{ "en": "...", "id": "..." }` objects) or tell the user to edit at `/admin`.
2. **Design/Layout changes:** Keep zero decorative gimmick clutter (no splash locks, cursor overrides, fake progress bars, or hardcoded testimonials). Maintain Light default + `.dark` CSS tokens in `src/app/globals.css`.
3. **Verify before finishing:** Run `npm test`, `npm run lint`, and `npm run build` in `C:\Users\Administrator\Documents\vadlycv-v2`.
