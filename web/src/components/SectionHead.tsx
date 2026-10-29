import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

/** Section heading styled as a shell prompt, a bright title and a # comment. */
export default function SectionHead({
  id,
  command,
  title,
  lead,
}: {
  /** id of the h2, referenced by the section's aria-labelledby. */
  id: string;
  /** Shell command shown above the title, e.g. "bwiz help". */
  command: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <Reveal className="section-head">
      <p className="prompt">{command}</p>
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {lead && <p className="section-lead">{lead}</p>}
    </Reveal>
  );
}
