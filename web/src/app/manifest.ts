import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bash Wizardry",
    short_name: "Bash Wizardry",
    description:
      "Transform your daily workflow with intelligent, context-aware spells.",
    start_url: "/",
    display: "standalone",
    background_color: "#07060f",
    theme_color: "#07060f",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
