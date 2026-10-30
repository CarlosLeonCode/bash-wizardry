// No-op stand-in for @carlosleoncode/lead-capture, a private package that only
// installs with a GitHub Packages token (it is an optionalDependency, so a
// plain `npm install` skips it). When the package is missing, Turbopack
// aliases it here (turbopack.resolveAlias in next.config.ts) and TypeScript
// reads these types (src/types/lead-capture.d.ts). When it is installed, both
// use the real package.
//
// Only the subset the site uses lives here, with the package's signatures
// (v0.2.0, dist/index.d.ts). Keep them in sync when the site uses more.

/** Role slugs stored by the backend. */
export type RoleSlug =
  | "diseno"
  | "desarrollo"
  | "producto"
  | "marketing"
  | "soporte"
  | "educacion"
  | "estudiante"
  | "otro";

export interface CountryOption {
  code: string;
  name: string;
}

export interface RoleOption {
  value: string;
  label: string;
}

export interface ShowPolicyConfig {
  triggerEvents: readonly string[] | null;
  triggerCount: number;
  promptOnReturn: boolean;
  dismissCooldownDays: readonly number[];
  maxDismissals: number | null;
  respectPrivacySignals: boolean;
  /** @deprecated Ignored since 0.2.0. */
  minSessionMs?: number;
  /** @deprecated Ignored since 0.2.0. */
  minPageViews?: number;
}

type FieldErrorCode = "required" | "invalid" | "too_long" | "not_allowed";

export type LeadCaptureErrorCode =
  | FieldErrorCode
  | "rate_limited"
  | "network"
  | "server";

export interface LeadCaptureCopy {
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  consentLabel: string;
  privacyLink: string;
  newTabHint: string;
  submit: string;
  submitting: string;
  notNow: string;
  close: string;
  detailsTitle: string;
  detailsDescription: string;
  nameLabel: string;
  roleLabel: string;
  countryLabel: string;
  selectPlaceholder: string;
  save: string;
  skip: string;
  successTitle: string;
  announcement: string;
  errors: Record<LeadCaptureErrorCode, string> & {
    email: Partial<Record<LeadCaptureErrorCode, string>>;
    consent: Partial<Record<LeadCaptureErrorCode, string>>;
  };
}

export type LeadCaptureCopyOverrides = Partial<
  Omit<LeadCaptureCopy, "errors">
> & {
  errors?: Partial<Omit<LeadCaptureCopy["errors"], "email" | "consent">> & {
    email?: Partial<Record<LeadCaptureErrorCode, string>>;
    consent?: Partial<Record<LeadCaptureErrorCode, string>>;
  };
};

export interface LeadCaptureTheme {
  accent?: string;
  accentText?: string;
  background?: string;
  text?: string;
  mutedText?: string;
  border?: string;
  fieldBackground?: string;
  radius?: string;
  font?: string;
  shadow?: string;
  backdropFilter?: string;
  zIndex?: number;
}

/** The options form of the package's LeadCaptureProps (no `controller`). */
export interface LeadCaptureProps {
  project: string;
  endpoint: string;
  source?: string;
  locale?: string;
  policy?: Partial<ShowPolicyConfig>;
  showDelayMs?: number;
  returnDelayMs?: number;
  successHideMs?: number;
  productName: string;
  privacyUrl: string;
  copy?: LeadCaptureCopyOverrides;
  theme?: LeadCaptureTheme;
  className?: string;
  position?: "bottom-right" | "bottom-left";
  roles?: readonly RoleOption[];
  countries?: readonly CountryOption[] | "all";
  countryNamesLocale?: string;
}

/** Renders nothing: there is no backend to talk to without the package. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LeadCapture(props: LeadCaptureProps): null {
  return null;
}

/** No-op: nothing listens for value moments. */
export function recordLeadEvent(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: { project?: string },
): void {}

/** No-op: there is no card to open. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function openLeadCapture(options?: { project?: string }): void {}
