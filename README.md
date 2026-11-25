# Vadly CV v2 — Creative Producer & AI-Assisted Video Strategist

Portfolio & ATS-ready CV built for global remote teams and Netherlands relocation, designed for effortless editing both via `/admin` (zero coding) and AI coding agents.

## Routes
- `/` — Editorial Light (default) & Dark Mode portfolio (`EN` default + `ID` toggle)
- `/cv` — Printable A4 European/ATS resume (`Save / Print PDF`)
- `/admin` — PIN-protected visual editor with browser draft preview, JSON download, and 1-click GitHub auto-publish

## Setup & Deployment (Vercel)
1. Push this folder to `https://github.com/vadlyvldr/MY-CV-PORTFOLIO` (via Chrome signed in as `vadlyvldr@gmail.com`).
2. On Vercel (`vadlyvldr` account), set these **Environment Variables**:
   - `ADMIN_PIN` = PIN rahasia lo untuk masuk `/admin`
   - `ADMIN_SESSION_SECRET` = string acak panjang
   - `GITHUB_TOKEN` = GitHub Personal Access Token (`Contents: Read & Write` di repo `MY-CV-PORTFOLIO`) supaya tombol **Save & Publish Live** di `/admin` otomatis commit & redeploy
   - `GITHUB_REPO` = `vadlyvldr/MY-CV-PORTFOLIO`
   - `GITHUB_BRANCH` = `main`
