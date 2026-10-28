import Reveal from "@/components/Reveal";
import SpellbookTabs from "@/components/SpellbookTabs";
import { spellbook } from "@/lib/content";

export default function SpellbookSection() {
  return (
    <section
      id="spellbook"
      className="section"
      aria-labelledby="spellbook-title"
    >
      <div className="container">
        <Reveal className="section-head section-head--center">
          <p className="eyebrow">Spellbook</p>
          <h2 id="spellbook-title" className="section-title">
            Every spell, one glance away
          </h2>
          <p className="section-lead">
            The command reference by module. Commands marked{" "}
            <span className="inline-code">confirms</span> ask before doing
            anything destructive.
          </p>
        </Reveal>

        <SpellbookTabs modules={spellbook} />
      </div>
    </section>
  );
}
