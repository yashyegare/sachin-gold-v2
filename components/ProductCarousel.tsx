"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductEnquiryCard from "@/components/ProductEnquiryCard";
import type { Product } from "@/lib/types";

/**
 * Horizontal, scroll-snap product strip — added after reviewing
 * sonaidairy.com's product carousels. Used on the service detail page,
 * where a service's product count varies from 1 to 8 (see
 * data/products.ts): a fixed grid either wastes space for a
 * single-product service or forces 2-3 grid rows for an 8-product one.
 * A horizontal strip handles both without a conditional layout, and
 * doubles as one of the "break the grid-of-grids rhythm" moments from
 * the design review — this is the one page-section on the site that
 * isn't a static grid or a two-column block.
 *
 * Native scroll-snap, not a JS carousel library: works with touch/
 * trackpad swipe for free, degrades to an ordinary (if non-scrolling)
 * row when content fits without overflow, and needs no extra bundle
 * weight. The arrow buttons are a desktop-only affordance layered on
 * top for people using a mouse; they scroll by one card's width and
 * disable themselves at each end rather than wrapping, so there's never
 * a dead click. Keyboard users can Tab to the strip itself and use the
 * arrow keys — native scroll containers support that with no extra code
 * once tabIndex makes the region focusable.
 */
export default function ProductCarousel({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    // Re-check on resize too — a strip that overflowed on mobile may not
    // overflow at all once the viewport is wide enough to fit every card.
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-item]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const showArrows = products.length > 2;

  return (
    <div className="relative">
      {showArrows && (
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
          aria-label="Scroll products left"
          className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white text-pine shadow-elevated-sm transition-opacity hover:bg-linen disabled:pointer-events-none disabled:opacity-0 sm:flex"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
      )}

      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        tabIndex={0}
        role="region"
        aria-label="Products, scrollable"
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:px-0"
      >
        {products.map((product) => (
          <div
            key={product.slug}
            data-carousel-item
            className="w-[240px] shrink-0 snap-start sm:w-[260px]"
          >
            <ProductEnquiryCard product={product} />
          </div>
        ))}
      </div>

      {showArrows && (
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
          aria-label="Scroll products right"
          className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white text-pine shadow-elevated-sm transition-opacity hover:bg-linen disabled:pointer-events-none disabled:opacity-0 sm:flex"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
