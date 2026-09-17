import type { Metadata } from "next";
import { company } from "@/data/company";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl text-ink">Contact</h1>
      <p className="mt-6 text-ink/70">{company.address}</p>
      <p className="mt-2 text-ink/70">{company.phone}</p>
      <p className="mt-2 text-ink/70">{company.email}</p>
      <p className="mt-8 text-sm text-ink/50">
        TODO: rebuild the contact form (previously PHP form handling via
        assets/vendor/php-email-form) — decide whether to keep a PHP
        endpoint or move to a Next.js API route / form service.
      </p>
    </section>
  );
}
