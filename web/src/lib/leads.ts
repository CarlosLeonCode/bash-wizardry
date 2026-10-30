// Optional "get updates" subscription (@carlosleoncode/lead-capture). No
// imports, so client components can use it.
//
// Everything lead-related (the card, the footer button, the privacy pages and
// their sitemap entries) exists only when NEXT_PUBLIC_LEADS_ENDPOINT is set at
// build time AND the private package is installed (next.config.ts sets
// LEAD_CAPTURE_INSTALLED). Otherwise the site collects no personal data and
// shows no dead button, so forks and builds without a token stay clean.

/** The `leads` Supabase Edge Function, e.g. https://<ref>.supabase.co/functions/v1/leads. */
export const LEADS_ENDPOINT = process.env.NEXT_PUBLIC_LEADS_ENDPOINT?.trim() ?? "";

export const LEADS_ENABLED =
  LEADS_ENDPOINT !== "" && process.env.LEAD_CAPTURE_INSTALLED === "true";

/** Project slug; must be in the function's ALLOWED_PROJECTS. */
export const LEADS_PROJECT = "bash-wizardry";

/** Value moment: the install command was copied. */
export const LEAD_EVENT_COPY_INSTALL = "copy-install";
