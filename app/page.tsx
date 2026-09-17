import { company } from "@/data/company";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="max-w-xl font-display text-4xl leading-tight text-ink sm:text-5xl">
        {company.tagline}
      </p>
      <p className="mt-6 max-w-prose text-ink/70">
        This is a placeholder home page — enough to view the Navbar and
        Footer in context while the Hero, ServiceCard and other components
        are built out.
      </p>
    </section>
  );
}
