import { buildLlmsFullTxt, textResponse } from "@/lib/llms";

// Generated at build time from the catalog and src/lib/llms.ts.
export const dynamic = "force-static";

export function GET() {
  return textResponse(buildLlmsFullTxt("es"));
}
