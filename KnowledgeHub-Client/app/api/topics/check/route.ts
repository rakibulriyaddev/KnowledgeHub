import type { NextRequest } from "next/server";
import { isAuthoringEnabled } from "@/lib/authoring";
import { topicExists } from "@/lib/vault";
import { slugify } from "@/lib/slug";

/**
 * Live topic-name availability check for the "Add Knowledge" dialog (debounced
 * polling, GitHub-repo style). Returns the derived slug and whether it's free.
 * Authoring-gated so it does nothing on the read-only deployed site.
 */
export async function GET(request: NextRequest) {
  if (!isAuthoringEnabled()) {
    return Response.json({ error: "disabled" }, { status: 403 });
  }

  const name = request.nextUrl.searchParams.get("name") ?? "";
  const slug = slugify(name);

  if (!slug) {
    return Response.json({ slug: "", available: false, reason: "invalid" });
  }

  const exists = await topicExists(slug);
  return Response.json({
    slug,
    available: !exists,
    reason: exists ? "taken" : "available",
  });
}
