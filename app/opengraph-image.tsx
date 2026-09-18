import { ImageResponse } from "next/og";

// Branded social-share card, generated at build time — no binary asset to
// maintain. Same language as the hero: pine gradient, wheat accent, serif
// display. File convention: Next picks this up automatically for every
// page that doesn't define its own OG image.
export const runtime = "edge";

export const alt = "Sachin Gold — Bulk Agro Commodity Trading & Processing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0A3620 0%, #0F4C2E 55%, #0c3a24 100%)",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#D9A93C",
          }}
        >
          Bulk Agro Commodities, Since 1969
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Trusted trading and processing for India&apos;s agro commodities
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <div style={{ display: "flex" }}>Sachin Gold</div>
          <div style={{ display: "flex", color: "#D9A93C" }}>
            Maharashtra · Karnataka
          </div>
        </div>
      </div>
    ),
    size,
  );
}
