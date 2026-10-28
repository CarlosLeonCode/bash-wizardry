import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import FeaturesSection from "@/components/FeaturesSection";
import SpellbookSection from "@/components/SpellbookSection";
import InstallSection from "@/components/InstallSection";
import ContributionSection from "@/components/ContributionSection";
import Footer from "@/components/Footer";
import { REPO_URL, SITE_URL } from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bash Wizardry",
  url: SITE_URL,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Linux, Windows (WSL)",
  description:
    "A curated suite of context-aware shell spells for Bash and Zsh. Pure shell, no binaries, 100% under your control.",
  license: "https://opensource.org/licenses/MIT",
  sameAs: [REPO_URL],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Carlos Leon",
    url: "https://github.com/CarlosLeonCode",
  },
};

export default function Home() {
  return (
    <div id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <HeroSection />
        <ShowcaseSection />
        <FeaturesSection />
        <SpellbookSection />
        <InstallSection />
        <ContributionSection />
      </main>

      <Footer />
    </div>
  );
}
