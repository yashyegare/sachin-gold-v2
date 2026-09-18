interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  as?: "h1" | "h2";
  align?: "left" | "center";
}

/**
 * Heading used at the top of every content section (services, products,
 * testimonials, etc). Left-aligned by default to match the rest of the
 * site's layout — centered is available for the rare section that calls
 * for it (a closing CTA band, say), not as the default.
 *
 * Eyebrows on light surfaces are pine, not gold: green carries the UI and
 * gold stays reserved for the deliberate moments (hero eyebrow/CTA, stat
 * numbers). `as="h1"` for page headers, default h2 for sections.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-wide text-pine">
          {eyebrow}
        </p>
      )}
      <Heading className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        {title}
      </Heading>
      {description && <p className="mt-4 text-ink/70">{description}</p>}
    </div>
  );
}
