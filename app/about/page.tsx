import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl text-ink">About Us</h1>
      <p className="mt-6 max-w-prose text-ink/70">
        TODO: migrate copy from the current about.html page.
      </p>
    </section>
  );
}
