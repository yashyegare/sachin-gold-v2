import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import TeamMemberCard from "@/components/TeamMember";
import Testimonial from "@/components/Testimonial";
import CTA from "@/components/CTA";
import { company } from "@/data/company";
import { team } from "@/data/team";
import { testimonial } from "@/data/testimonial";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Since 1969, Hude Group has served the nation with Sortex-quality agro commodities — 550 tons/day processing capacity and 1.5 lakh farmers connected via ITC e-Choupal.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Intro band — same pine-deep language as the Hero, scaled down for
          an inner page rather than a full banner. */}
      <section className="bg-pine-deep px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl text-white sm:text-4xl">
            About {company.name}
          </h1>
          <div className="mt-6 space-y-4 text-white/80">
            <p>
              Since {company.foundedYear}, {company.groupName} has been
              serving the nation with the finest Sortex-quality agro
              commodities, along with premium finished products and related
              services such as transportation, warehousing, and cold storage.
              Backed by decades of trust and continuous investment in modern
              technology, we ensure that every grain reaches our customers
              with purity, nutrition, and natural goodness.
            </p>
            <p>
              We are proudly present across Maharashtra and Karnataka, in
              regions including {company.locations.join(", ")}. Our strong
              geographical presence allows us to offer high-protein crops of
              superior quality while being strategically located for easy
              access and round-the-clock service.
            </p>
            <p>
              At the heart of our operations is a strong belief in empowering
              our agricultural community. Through the{" "}
              <a
                href="https://itcportal.com/itc-businesses/agri-business/itc-e-choupal.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wheat-bright underline underline-offset-2 hover:text-white"
              >
                ITC e-Choupal
              </a>{" "}
              initiative, we&apos;ve fostered deep bonds with our growers,
              connecting over {company.farmersConnected! / 100000} lakh
              farmers and customers to promote sustainable, mutually
              beneficial trade.
            </p>
          </div>
        </div>
      </section>

      {/* State-of-the-art processing */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading
              eyebrow="Our Facilities"
              title="State-of-the-art processing"
              description={`Today we are one of the leading players in processed pulses, operating with a combined capacity of ${company.processingCapacityTonsPerDay} tons per day.`}
            />
            <ul className="mt-6 space-y-2 text-ink/70">
              <li>— Retains the natural essence of the grains</li>
              <li>— Unpolished pulses</li>
              <li>— Free of preservatives and artificial colors</li>
            </ul>
            <Link
              href="/contact"
              className="mt-8 inline-block rounded-sm bg-pine px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pine-deep"
            >
              Get in touch
            </Link>
          </div>

          {/* TODO: assets/img/video_img_2.png + the YouTube facility tour
              (youtu.be/v8zIFCYXlDs) exist on the old site — placeholder
              tile until that's migrated. */}
          <a
            href="https://youtu.be/v8zIFCYXlDs"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br from-pine-deep via-pine to-[#0c3a24] transition-shadow hover:shadow-[0_14px_36px_-16px_rgba(10,54,32,0.5)]"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-wheat transition-transform group-hover:scale-105">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="white"
                aria-hidden="true"
              >
                <path d="M5 3l12 7-12 7V3z" />
              </svg>
            </span>
            <span className="absolute bottom-4 left-0 right-0 text-center text-xs font-medium uppercase tracking-widest text-white/0 transition-colors duration-200 group-hover:text-white/70">
              Watch the facility tour
            </span>
            <span className="sr-only">Watch our facility tour on YouTube</span>
          </a>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-ink/10 bg-linen px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Leadership" title="Team" align="center" />
          <div className="mx-auto mt-12 grid max-w-3xl gap-10 sm:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="space-y-2">
                <TeamMemberCard member={member} />
                {member.facebook && (
                  <p className="text-center">
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-ink/50 transition-colors hover:text-pine"
                    >
                      Facebook profile ↗
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The one real testimonial — see data/testimonial.ts for why this
          is intentionally singular. */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <SectionHeading
          eyebrow="Partner Success Story"
          title="Hear from a partner who trusts us"
        />
        <div className="mt-8">
          <Testimonial testimonial={testimonial} />
        </div>
      </section>

      <CTA />
    </>
  );
}
