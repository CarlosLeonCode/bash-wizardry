import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { PRIVACY } from "@/lib/site";

// Body of /privacy and /es/privacidad, adapted from clc-leads'
// PRIVACY_TEMPLATE.md. The Spanish text follows the template; the English one
// is its translation. Author data comes from PRIVACY (src/lib/site.ts).
// Legal references: Colombia (Ley 1581 de 2012, Decreto 1377 de 2013) and the
// European Union (GDPR / RGPD).

const PRODUCT = "bash-wizardry";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2>
        <span aria-hidden="true">## </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Email() {
  return <a href={`mailto:${PRIVACY.contactEmail}`}>{PRIVACY.contactEmail}</a>;
}

function Updated({ label }: { label: string }) {
  return (
    <p>
      <em>
        {label}: <time dateTime={PRIVACY.lastUpdated}>{PRIVACY.lastUpdated}</time>.
      </em>
    </p>
  );
}

function PolicyEn() {
  const { otherToolsBrand: brand, responseDays } = PRIVACY;
  return (
    <>
      <p>
        {PRODUCT} works without accounts: you can use the site and the shell
        tools without signing up. If you want, you can leave your email to get
        news about the project. This page explains what data we keep, why, and
        how you can change your mind.
      </p>

      <Section title="Controller">
        <p>
          {PRIVACY.controller}, {PRIVACY.location}. Contact: <Email />.
        </p>
      </Section>

      <Section title="What data we collect">
        <p>Only what you give us in the form, and only when you submit it:</p>
        <ul>
          <li>
            <strong>Email address</strong> (required to subscribe).
          </li>
          <li>
            <strong>Name, what you do and country</strong> (optional; you can
            skip that step).
          </li>
          <li>
            <strong>Proof of your consent</strong>: the exact text you agreed
            to and the date.
          </li>
          <li>
            <strong>Minimal technical data</strong>: the project and the place
            where you subscribed (this site), your browser language and the
            kind of browser (for example, &quot;Chrome&quot; or &quot;Safari on
            mobile&quot;), without versions or device identifiers.
          </li>
        </ul>
        <p>
          <strong>We do not store</strong> your IP address (to stop abuse we
          use an encrypted, irreversible digest that is deleted shortly after),
          your location, tracking cookies, or anything about how you use{" "}
          {PRODUCT} in your terminal: the shell tools have no telemetry. The
          prompt&apos;s preferences (whether you closed it or subscribed) are
          kept only in your browser.
        </p>
      </Section>

      <Section title="What we use it for">
        <ul>
          <li>
            Sending you occasional news about {PRODUCT}
            {brand && <> and other tools by {brand}</>}.
          </li>
          <li>
            Understanding, in aggregate, who uses {PRODUCT} (for example, how
            many people work in development or in design) to decide what to
            improve.
          </li>
        </ul>
        <p>We do not sell your data or hand it over to third parties for their own use.</p>
      </Section>

      <Section title="Legal basis">
        <p>
          Your <strong>prior, express and informed consent</strong>, which you
          give by ticking the box (Colombian Law 1581 of 2012, art. 9, and
          Decree 1377 of 2013; GDPR, art. 6(1)(a)). You can withdraw it at any
          time; doing so does not affect the emails sent before.
        </p>
      </Section>

      <Section title="Processors">
        <p>
          We use providers that process the data on our behalf and under our
          instructions:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> (database). Region: {PRIVACY.supabaseRegion}.
          </li>
          {PRIVACY.usesBrevo === true && (
            <li>
              <strong>Brevo</strong> (sending emails and handling unsubscribes).
            </li>
          )}
        </ul>
        <p>
          Some of these providers may store data outside your country. When
          that happens, they do so with appropriate contractual safeguards.
        </p>
      </Section>

      <Section title="How long we keep it">
        <p>
          While you stay subscribed. If you unsubscribe, we stop writing to you
          right away and delete your data within{" "}
          {PRIVACY.retentionDaysAfterUnsubscribe} days, except for the minimum
          record needed to never write to you again. If{" "}
          {PRIVACY.inactiveListMonths} months go by without us sending any{" "}
          {PRODUCT} news, we delete the list.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          You can <strong>know, update, correct and delete</strong> your data,{" "}
          <strong>withdraw your consent</strong> and ask for{" "}
          <strong>proof of the authorization</strong> you gave (Law 1581, art.
          8). If you are in the European Union, you also have the rights of{" "}
          <strong>
            access, rectification, erasure, restriction, objection and
            portability
          </strong>{" "}
          (GDPR, arts. 15 to 21).
        </p>
        <p>
          To exercise them, write to <Email />. We will answer within{" "}
          {responseDays.queries} business days for queries and{" "}
          {responseDays.claims} business days for claims, as Law 1581 provides.
        </p>
        <p>
          If you are not satisfied, you can contact the{" "}
          <strong>Superintendencia de Industria y Comercio</strong> (Colombia)
          or the data protection authority of your country.
        </p>
      </Section>

      <Section title="How to unsubscribe">
        <ul>
          <li>
            {PRIVACY.usesBrevo === true
              ? "With the unsubscribe link included in every email, or"
              : "By replying to any of our emails asking to unsubscribe, or"}
          </li>
          <li>
            by writing to <Email /> from the subscribed address.
          </li>
        </ul>
      </Section>

      <Section title="Minors">
        <p>
          The subscription is meant for people aged {PRIVACY.minimumAge} or
          older. If you are younger, ask your parent or guardian to authorize
          it.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          If we change this policy in an important way, we will say so here
          with the date of the update.
        </p>
        <Updated label="Last updated" />
      </Section>
    </>
  );
}

function PolicyEs() {
  const { otherToolsBrand: brand, responseDays } = PRIVACY;
  return (
    <>
      <p>
        {PRODUCT} funciona sin cuentas: puedes usar el sitio y las
        herramientas de terminal sin registrarte. Si quieres, puedes dejarnos
        tu correo para recibir novedades del proyecto. Esta página explica qué
        datos guardamos, para qué y cómo puedes cambiar de opinión.
      </p>

      <Section title="Responsable">
        <p>
          {PRIVACY.controller}, {PRIVACY.location}. Contacto: <Email />.
        </p>
      </Section>

      <Section title="Qué datos recogemos">
        <p>Solo los que tú nos das en el formulario, y solo cuando lo envías:</p>
        <ul>
          <li>
            <strong>Correo electrónico</strong> (obligatorio para suscribirte).
          </li>
          <li>
            <strong>Nombre, a qué te dedicas y país</strong> (opcionales;
            puedes saltar ese paso).
          </li>
          <li>
            <strong>Prueba de tu consentimiento</strong>: el texto exacto que
            aceptaste y la fecha.
          </li>
          <li>
            <strong>Datos técnicos mínimos</strong>: el proyecto y el punto
            desde el que te suscribiste (este sitio), el idioma de tu navegador
            y el tipo de navegador (por ejemplo, &quot;Chrome&quot; o
            &quot;Safari en móvil&quot;), sin versiones ni identificadores del
            dispositivo.
          </li>
        </ul>
        <p>
          <strong>No guardamos</strong> tu dirección IP (para frenar abusos
          usamos un resumen cifrado e irreversible que se borra en poco
          tiempo), ni tu ubicación, ni cookies de seguimiento, ni nada sobre
          cómo usas {PRODUCT} en tu terminal: las herramientas no tienen
          telemetría. Las preferencias del aviso (si ya lo cerraste o te
          suscribiste) se guardan solo en tu navegador.
        </p>
      </Section>

      <Section title="Para qué los usamos">
        <ul>
          <li>
            Enviarte de vez en cuando novedades de {PRODUCT}
            {brand && <> y de otras herramientas de {brand}</>}.
          </li>
          <li>
            Entender, de forma agregada, quién usa {PRODUCT} (por ejemplo,
            cuántas personas de desarrollo o de diseño) para decidir qué
            mejorar.
          </li>
        </ul>
        <p>No vendemos ni cedemos tus datos a terceros para su propio uso.</p>
      </Section>

      <Section title="Base legal">
        <p>
          Tu <strong>consentimiento previo, expreso e informado</strong>, que
          das al marcar la casilla (Ley 1581 de 2012, art. 9, y Decreto 1377 de
          2013; RGPD, art. 6.1.a). Puedes retirarlo en cualquier momento sin
          que eso afecte a los envíos anteriores.
        </p>
      </Section>

      <Section title="Encargados del tratamiento">
        <p>
          Usamos proveedores que tratan los datos en nuestro nombre y bajo
          nuestras instrucciones:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> (base de datos). Región:{" "}
            {PRIVACY.supabaseRegion}.
          </li>
          {PRIVACY.usesBrevo === true && (
            <li>
              <strong>Brevo</strong> (envío de correos y gestión de bajas).
            </li>
          )}
        </ul>
        <p>
          Algunos de estos proveedores pueden almacenar datos fuera de tu país.
          Cuando eso ocurre, lo hacen con garantías contractuales adecuadas.
        </p>
      </Section>

      <Section title="Cuánto tiempo los conservamos">
        <p>
          Mientras sigas suscrito. Si te das de baja, dejamos de escribirte de
          inmediato y borramos tus datos en un plazo de{" "}
          {PRIVACY.retentionDaysAfterUnsubscribe} días, salvo el registro
          mínimo necesario para no volver a escribirte. Si pasan{" "}
          {PRIVACY.inactiveListMonths} meses sin que enviemos novedades de{" "}
          {PRODUCT}, eliminamos la lista.
        </p>
      </Section>

      <Section title="Tus derechos">
        <p>
          Puedes <strong>conocer, actualizar, rectificar y suprimir</strong>{" "}
          tus datos, <strong>revocar tu consentimiento</strong> y pedir{" "}
          <strong>prueba de la autorización</strong> que diste (Ley 1581, art.
          8). Si estás en la Unión Europea, también tienes derecho de{" "}
          <strong>
            acceso, rectificación, supresión, limitación, oposición y
            portabilidad
          </strong>{" "}
          (RGPD, arts. 15 a 21).
        </p>
        <p>
          Para ejercerlos, escribe a <Email />. Te responderemos en un máximo
          de {responseDays.queries} días hábiles para consultas y{" "}
          {responseDays.claims} días hábiles para reclamos, como prevé la Ley
          1581.
        </p>
        <p>
          Si no quedas conforme, puedes acudir a la{" "}
          <strong>Superintendencia de Industria y Comercio</strong> (Colombia)
          o a la autoridad de protección de datos de tu país.
        </p>
      </Section>

      <Section title="Cómo darte de baja">
        <ul>
          <li>
            {PRIVACY.usesBrevo === true
              ? "Con el enlace para darte de baja que incluye cada correo, o"
              : "Respondiendo a cualquiera de nuestros correos para pedir la baja, o"}
          </li>
          <li>
            escribiendo a <Email /> desde la dirección suscrita.
          </li>
        </ul>
      </Section>

      <Section title="Menores de edad">
        <p>
          La suscripción está pensada para mayores de {PRIVACY.minimumAge}{" "}
          años. Si eres menor, pide a tu madre, padre o tutor que lo autorice.
        </p>
      </Section>

      <Section title="Cambios">
        <p>
          Si cambiamos esta política de forma importante, lo indicaremos aquí
          con la fecha de actualización.
        </p>
        <Updated label="Última actualización" />
      </Section>
    </>
  );
}

/** The policy text for one locale (headings are <h2>; the page owns the <h1>). */
export default function PrivacyPolicy({ locale }: { locale: Locale }) {
  return locale === "es" ? <PolicyEs /> : <PolicyEn />;
}
