"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav } from "@/data/navigation";
import { company } from "@/data/company";

/**
 * Site header / primary navigation.
 *
 * Replaces the header markup that was previously copy-pasted into all
 * ~10 HTML pages. Nav structure comes from `data/navigation.ts`, so
 * adding or renaming a service updates every page that renders this
 * component.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);

  // Close the services dropdown on outside click or Escape.
  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Close the mobile panel on route change.
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-ink"
          aria-label={`${company.name} — home`}
        >
          {company.name}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm">
            {primaryNav.map((item) => {
              if (item.children) {
                return (
                  <li
                    key={item.href}
                    ref={servicesRef}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      type="button"
                      className="flex items-center gap-1 py-2 text-ink/80 transition-colors hover:text-pine aria-expanded:text-pine"
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                      onClick={() => setServicesOpen((open) => !open)}
                    >
                      {item.label}
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        aria-hidden="true"
                        className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                      >
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>

                    {servicesOpen && (
                      <div className="absolute left-1/2 top-full w-[30rem] -translate-x-1/2 pt-3">
                        <div className="rounded-sm border border-ink/10 bg-white p-2 shadow-[0_12px_32px_-12px_rgba(22,35,28,0.18)]">
                          <ul className="grid grid-cols-1 gap-0.5">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className="block rounded-sm px-4 py-3 text-ink/80 transition-colors hover:bg-linen hover:text-pine"
                                >
                                  <span className="block text-sm font-medium">
                                    {child.label}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`py-2 transition-colors hover:text-pine ${
                      isActive(item.href) ? "text-pine" : "text-ink/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
            className="text-sm text-ink/70 hover:text-pine"
          >
            {company.phone}
          </a>
          <Link
            href="/contact"
            className="rounded-sm bg-pine px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pine-deep"
          >
            Get in touch
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-[1.5px] w-full bg-ink transition-transform ${
                mobileOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-[1.5px] w-full bg-ink transition-opacity ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-[1.5px] w-full bg-ink transition-transform ${
                mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-ink/10 bg-white md:hidden"
        >
          <ul className="flex flex-col divide-y divide-ink/10 px-6">
            {primaryNav.map((item) => (
              <li key={item.href} className="py-1">
                <Link
                  href={item.href}
                  className={`block py-3 text-base ${
                    isActive(item.href) ? "text-pine" : "text-ink/80"
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="pb-2 pl-4">
                    {item.children
                      .filter((child) => child.href !== item.href)
                      .map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block py-2 text-sm text-ink/60 hover:text-pine"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="py-4">
              <Link
                href="/contact"
                className="block rounded-sm bg-pine px-4 py-3 text-center text-sm font-medium text-white"
              >
                Get in touch
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
