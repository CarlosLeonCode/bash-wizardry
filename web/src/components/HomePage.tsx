import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AgentsSection from "@/components/AgentsSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import Sidebar from "@/components/Sidebar";
import SpellbookSection from "@/components/SpellbookSection";
import InstallSection from "@/components/InstallSection";
import MoreToolsSection from "@/components/MoreToolsSection";
import ContributionSection from "@/components/ContributionSection";
import Footer from "@/components/Footer";
import TopLinks from "@/components/TopLinks";
import { getDictionary, type Locale } from "@/lib/i18n";
import { jsonLdScript } from "@/lib/i18n/metadata";
import { SPELL_COUNT } from "@/lib/site";

/** The landing page, rendered once per locale (app/(en) and app/(es)). */
export default function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(locale) }}
      />
      <a href="#main" className="skip-link">
        {t.common.skipToContent}
      </a>

      <TopLinks t={t} />
      <Navbar
        locale={locale}
        t={t.nav}
        newTab={t.common.newTab}
        spellCount={SPELL_COUNT}
      />

      <div className="frame">
        <Sidebar t={t.sidebar} />
        <main id="main">
          <HeroSection locale={locale} t={t} />
          <AgentsSection t={t.agents} />
          <ShowcaseSection t={t.showcase} />
          <PrinciplesSection t={t.principles} />
          <SpellbookSection locale={locale} t={t.spellbook} />
          <InstallSection t={t} />
          <MoreToolsSection t={t} />
          <ContributionSection t={t} />
        </main>
      </div>

      <Footer locale={locale} t={t} />
    </div>
  );
}
