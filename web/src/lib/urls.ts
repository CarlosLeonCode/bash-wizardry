// URLs and author details. No imports, so client components can use them
// without pulling the catalog into the browser bundle.

export const REPO_URL = "https://github.com/CarlosLeonCode/bash-wizardry";
export const ISSUES_URL = `${REPO_URL}/issues`;
export const SITE_URL = "https://bashwizardry.com";

/** The author, as credited on the site. */
export const AUTHOR = {
  name: "Carlos Leon",
  handle: "carlosleoncode",
  url: "https://carlosleoncode.com",
  github: "https://github.com/CarlosLeonCode",
  youtube: "https://www.youtube.com/@carlosleoncode",
  kofi: "https://ko-fi.com/carlosleoncode",
} as const;
