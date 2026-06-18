import { isAuthoringEnabled } from "@/lib/authoring";
import { getVaultStatus } from "@/lib/git";

/**
 * Pending (uncommitted) vault files, shown in the commit dialog so the author
 * sees exactly what Save will commit. Authoring-gated.
 */
export async function GET() {
  if (!isAuthoringEnabled()) {
    return Response.json({ error: "disabled" }, { status: 403 });
  }
  try {
    const files = await getVaultStatus();
    return Response.json({ files });
  } catch {
    return Response.json({ files: [], error: "git status unavailable" });
  }
}
