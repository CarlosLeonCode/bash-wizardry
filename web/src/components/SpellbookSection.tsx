import SectionHead from "@/components/SectionHead";
import SpellbookTabs from "@/components/SpellbookTabs";
import RichText from "@/components/RichText";
import type { Dictionary, Locale } from "@/lib/i18n";
import { buildSpellbook } from "@/lib/site";

export default function SpellbookSection({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary["spellbook"];
}) {
  return (
    <section
      id="spellbook"
      className="section"
      aria-labelledby="spellbook-title"
    >
      <div className="container">
        <SectionHead
          id="spellbook-title"
          command="bwiz help"
          title={t.title}
          lead={<RichText text={t.lead} />}
        />

        <SpellbookTabs
          modules={buildSpellbook(locale, t.summaries)}
          t={{
            tablist: t.tablist,
            caption: t.caption,
            columns: t.columns,
            none: t.none,
          }}
        />
      </div>
    </section>
  );
}
