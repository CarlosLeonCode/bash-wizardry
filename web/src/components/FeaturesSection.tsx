import FeatureGrid from "@/components/FeatureGrid";
import Reveal from "@/components/Reveal";
import { features } from "@/lib/content";
import styles from "./FeaturesSection.module.css";

export default function FeaturesSection() {
  return (
    <section id="features" className="section" aria-labelledby="features-title">
      <div className="container">
        <Reveal className="section-head section-head--center">
          <p className="eyebrow">Principles</p>
          <h2 id="features-title" className="section-title">
            Powerful, but never <span className="text-gradient">reckless</span>
          </h2>
          <p className="section-lead">
            bash-wizardry is a set of plain shell functions you can read in an
            afternoon. It speeds you up without taking control away from you.
          </p>
        </Reveal>

        <FeatureGrid className={styles.grid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.card} data-card>
              <span className={styles.icon} aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.description}>{feature.description}</p>
              {feature.command && (
                <code className={styles.command}>
                  <span aria-hidden="true">$ </span>
                  {feature.command}
                </code>
              )}
            </article>
          ))}
        </FeatureGrid>
      </div>
    </section>
  );
}
