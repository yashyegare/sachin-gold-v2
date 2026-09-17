import Link from "next/link";
import { primaryNav } from "@/data/navigation";
import { company } from "@/data/company";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-linen">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="font-display text-lg text-ink">{company.name}</p>
          <p className="mt-2 max-w-xs text-sm text-ink/60">{company.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-2 text-sm">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink/70 hover:text-pine">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-2 text-sm text-ink/70">
          <p>{company.address}</p>
          <p>
            <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`} className="hover:text-pine">
              {company.phone}
            </a>
          </p>
          <p>
            <a href={`mailto:${company.email}`} className="hover:text-pine">
              {company.email}
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-ink/10 px-6 py-6 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} {company.name}. All rights reserved.
      </div>
    </footer>
  );
}
