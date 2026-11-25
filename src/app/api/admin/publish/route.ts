import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";
import { validateCvData } from "@/lib/cv-data";

interface UploadAssetInput {
  fileName: string;
  base64Content: string;
}

function sanitizeImageName(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "-");
  return base || `upload-${Date.now()}.png`;
}

async function upsertGitHubFile(params: {
  token: string;
  repo: string;
  branch: string;
  filePath: string;
  contentBase64: string;
  message: string;
}) {
  const apiUrl = `https://api.github.com/repos/${params.repo}/contents/${params.filePath}`;
  const headers = {
    Authorization: `Bearer ${params.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  let existingSha: string | undefined;
  const checkRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(params.branch)}`, {
    headers,
    cache: "no-store",
  });
  if (checkRes.ok) {
    const existing = (await checkRes.json()) as { sha?: string };
    existingSha = existing.sha;
  }

  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: params.message,
      content: params.contentBase64,
      branch: params.branch,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub API (${putRes.status}): ${errText.slice(0, 220)}`);
  }

  return (await putRes.json()) as { commit?: { html_url?: string; sha?: string } };
}

export async function POST(req: Request) {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ ok: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      cvData?: unknown;
      assetUpload?: UploadAssetInput;
      commitMessage?: string;
    };

    const validated = validateCvData(body?.cvData);
    if (!validated.ok) {
      return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
    }

    const updated = {
      ...validated.data,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    let uploadedAvatarPath: string | undefined;
    if (body.assetUpload?.fileName && body.assetUpload?.base64Content) {
      const safeName = sanitizeImageName(body.assetUpload.fileName);
      uploadedAvatarPath = `/images/${safeName}`;
      updated.profile.avatarUrl = uploadedAvatarPath;
    }

    const formattedJson = `${JSON.stringify(updated, null, 2)}\n`;
    const ghToken = process.env.GITHUB_TOKEN?.trim();
    const ghRepo = (process.env.GITHUB_REPO || "vadlyvldr/MY-CV-PORTFOLIO").trim();
    const ghBranch = (process.env.GITHUB_BRANCH || "main").trim();
    const message =
      (typeof body.commitMessage === "string" && body.commitMessage.trim()) ||
      "chore(cv): update content via /admin";

    if (ghToken) {
      if (body.assetUpload?.base64Content && uploadedAvatarPath) {
        const cleanB64 = body.assetUpload.base64Content.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
        await upsertGitHubFile({
          token: ghToken,
          repo: ghRepo,
          branch: ghBranch,
          filePath: `public${uploadedAvatarPath}`,
          contentBase64: cleanB64,
          message: `chore(assets): upload ${path.basename(uploadedAvatarPath)}`,
        });
      }

      const commitRes = await upsertGitHubFile({
        token: ghToken,
        repo: ghRepo,
        branch: ghBranch,
        filePath: "src/data/cv-data.json",
        contentBase64: Buffer.from(formattedJson, "utf-8").toString("base64"),
        message,
      });

      return NextResponse.json({
        ok: true,
        mode: "github",
        data: updated,
        commitUrl: commitRes.commit?.html_url || null,
        message: "Published to GitHub. Vercel will automatically redeploy in ~30 seconds.",
      });
    }

    if (process.env.NODE_ENV === "development") {
      if (body.assetUpload?.base64Content && uploadedAvatarPath) {
        const cleanB64 = body.assetUpload.base64Content.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
        const assetDiskPath = path.join(process.cwd(), "public", uploadedAvatarPath.replace(/^\//, ""));
        await fs.mkdir(path.dirname(assetDiskPath), { recursive: true });
        await fs.writeFile(assetDiskPath, Buffer.from(cleanB64, "base64"));
      }

      const jsonDiskPath = path.join(process.cwd(), "src", "data", "cv-data.json");
      await fs.writeFile(jsonDiskPath, formattedJson, "utf-8");

      return NextResponse.json({
        ok: true,
        mode: "local-disk",
        data: updated,
        message: "Saved directly to local src/data/cv-data.json.",
      });
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          "GITHUB_TOKEN is not configured on the server. Add GITHUB_TOKEN in Vercel Environment Variables to publish directly from /admin, or use Download JSON.",
      },
      { status: 503 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to publish changes.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
