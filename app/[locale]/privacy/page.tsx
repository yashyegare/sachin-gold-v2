import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SectionHeading from "@/components/SectionHeading";
import { buildAlternates } from "@/i18n/seo";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
    alternates: buildAlternates("/privacy"),
  };
}

// Long-tail legal prose: English-only for now, by design. The catalog's
// privacy section carries the translated title so chrome-level navigation
// is fully localized; translating legal prose is native-reviewer work
// (Phase 9), not machine work.
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  const sections: { heading: string; body: string[] }[] = [
    {
      heading: "What we collect",
      body: [
        "This website's enquiry form collects the information you type into it: your name, company name, email address, phone number and your requirement. The form is processed by Web3Forms, a third-party form processor, which forwards your submission to the company's email inbox.",
        "Like most websites, our hosting provider may also record standard technical information (IP address, browser type, pages visited) in server logs for security and reliability purposes.",
      ],
    },
    {
      heading: "How we use it",
      body: [
        "Enquiry details are used for exactly one purpose: responding to your request for pricing, availability or information about our products and services. We do not sell, rent or share your personal information with any third party for marketing purposes.",
        "We do not add you to mailing lists. There is no newsletter, no tracking pixels and no advertising cookies on this website.",
      ],
    },
    {
      heading: "What we don't do",
      body: [
        "We do not use analytics services that profile individual visitors. We do not embed advertising networks. We do not store your enquiry data on this website's servers — submissions live only in the company's own email inbox.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        "If you have submitted an enquiry and would like us to delete the information you provided, email us and we will remove it. You can always reach us by phone or WhatsApp instead of the form if you prefer not to share details online.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Questions about this policy: use the details on our Contact page. Sachin International Proteins Private Limited, Udgir, Dist. Latur, Maharashtra.",
      ],
    },
  ];

  return (
    <section className="section-standard mx-auto max-w-3xl px-6">
      <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} />
      <p className="mt-4 text-sm text-ink/50">{t("updated")}</p>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-xl text-ink">
              {section.heading}
            </h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-relaxed text-ink/70">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
