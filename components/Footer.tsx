import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
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
            <li>
              <Link href="/privacy" className="text-ink/70 hover:text-pine">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>

        <div className="space-y-2 text-sm text-ink/70">
          <p className="flex items-start gap-2">
            <MapPin size={14} className="mt-0.5 shrink-0 text-pine" aria-hidden="true" />
            {company.facilities[0]?.address}
          </p>
          <p>
            <a
              href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-2 hover:text-pine"
            >
              <Phone size={14} className="shrink-0 text-pine" aria-hidden="true" />
              {company.phone}
            </a>
          </p>
          <p>
            <a
              href={`mailto:${company.email}`}
              className="inline-flex items-center gap-2 hover:text-pine"
            >
              <Mail size={14} className="shrink-0 text-pine" aria-hidden="true" />
              {company.email}
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-ink/10 px-6 py-6 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} {company.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
