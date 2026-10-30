import type { MetadataRoute } from "next";
import { getDictionary } from "@/lib/i18n";

/** English only: a web manifest has one language, and "/" is the default. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bash Wizardry",
    short_name: "Bash Wizardry",
    description: getDictionary("en").meta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#020502",
    theme_color: "#020502",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
