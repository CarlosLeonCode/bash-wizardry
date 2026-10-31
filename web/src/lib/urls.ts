// URLs and author details. No imports, so client components can use them
// without pulling the catalog into the browser bundle.

export const REPO_URL = "https://github.com/CarlosLeonCode/bash-wizardry";
export const ISSUES_URL = `${REPO_URL}/issues`;
export const SITE_URL = "https://bashwizardry.carlosleoncode.com";

/** The author, as credited on the site. */
export const AUTHOR = {
  name: "Carlos Leon",
  handle: "carlosleoncode",
  url: "https://carlosleoncode.com",
  github: "https://github.com/CarlosLeonCode",
  youtube: "https://www.youtube.com/@carlosleoncode",
  kofi: "https://ko-fi.com/carlosleoncode",
} as const;

/**
 * The author's other tools, cross-linked from the nav, the top link strip,
 * the "more tools" section, the footer and llms.txt. Taglines and
 * descriptions live in the dictionaries, keyed by id.
 */
export const TOOLS = [
  {
    id: "clcagenda",
    name: "CLC Agenda",
    url: "https://clcagenda.carlosleoncode.com/",
  },
  {
    id: "watextly",
    name: "Watextly",
    url: "https://watextly.carlosleoncode.com/",
  },
  {
    id: "kaiflow",
    name: "Kaiflow",
    url: "https://kaiflow.carlosleoncode.com/",
  },
  { id: "captuflow", name: "CaptuFlow", url: "https://captuflow.com/" },
] as const satisfies readonly { id: string; name: string; url: string }[];

export type ToolId = (typeof TOOLS)[number]["id"];

/** Host of a tool's URL, e.g. "captuflow.com". */
export const toolHost = (url: string) => new URL(url).host;
