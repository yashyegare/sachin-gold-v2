import type { Metadata } from "next";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Sachin International Proteins Private Limited handles the personal information you submit through this website's contact form.",
  alternates: { canonical: "/privacy" },
};

// Added because the contact form now collects real personal data (name,
// company, email, phone, requirement) via Web3Forms. Plain prose, no
// component dependencies — keep it honest and specific to what the site
// actually does. If the form handler ever changes, update this page too.
export default function PrivacyPage() {
  return (
    <section className="section-standard mx-auto max-w-3xl px-6">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-ink/50">
        Last updated: September 2026
      </p>

      <div className="mt-10 space-y-8 text-ink/80">
        <section>
          <h2 className="font-display text-xl text-ink">What we collect</h2>
          <p className="mt-3 leading-relaxed">
            This website has one form: the contact form on our Contact page.
            If you submit it, we receive the details you choose to share —
            typically your name, company, email address, phone number, and a
            description of your requirement. We collect nothing else about
            you, and browsing the site does not require you to give us any
            personal information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">How it is handled</h2>
          <p className="mt-3 leading-relaxed">
            Form submissions are delivered to our email inbox through a
            third-party form-delivery service (Web3Forms). Your details are
            used for one purpose only: to respond to your enquiry about our
            products and services. We do not sell your information, we do not
            add you to marketing lists, and we do not share it with third
            parties beyond the delivery service needed to get your message
            to us.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Analytics &amp; cookies</h2>
          <p className="mt-3 leading-relaxed">
            This site does not set advertising or tracking cookies. If
            analytics are enabled in the future, this policy will be updated
            before that happens.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Retention &amp; your choices</h2>
          <p className="mt-3 leading-relaxed">
            We keep enquiry emails for as long as they are useful for our
            business relationship. If you would like us to delete a message
            you have sent, or correct any details you shared, email us at{" "}
            <a
              href={`mailto:${company.email}`}
              className="text-pine underline underline-offset-2 hover:text-pine-deep"
            >
              {company.email}
            </a>{" "}
            and we will do it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Contact</h2>
          <p className="mt-3 leading-relaxed">
            Questions about this policy can go to the same address, or to{" "}
            {company.name}, {company.facilities[0]?.address}.
          </p>
        </section>
      </div>
    </section>
  );
}
