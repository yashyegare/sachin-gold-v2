"use client";

import { useEffect, useState } from "react";

/**
 * The last page we control. `app/[locale]/layout.tsx` is this app's root
 * layout, which means a crash *inside* it — fonts, next-intl provider,
 * footer, analytics — has no error boundary above it, and Next serves its
 * own blank white screen with no styling, no language and no way back.
 *
 * So this file renders the whole document itself: `<html>`, `<body>`, and
 * inline styles only. Tailwind classes would be a promise we can't keep
 * here, since the stylesheet is imported by the layout that just failed.
 *
 * No next-intl either — the provider is what may have crashed. The six
 * strings are inlined instead, chosen from the visitor's own browser
 * (`NEXT_LOCALE` cookie, then `navigator.language`). That choice can only
 * be made on the client, so the page paints in English first and swaps on
 * mount: a one-frame flash beats the alternative of a Hindi visitor being
 * locked into English text React refuses to patch.
 */

const COPY = {
  en: {
    title: "Something went wrong",
    body: "An unexpected error interrupted this page. It has been logged — please try again, or head back to the homepage.",
    retry: "Try again",
    home: "Go to homepage",
  },
  hi: {
    title: "कुछ गड़बड़ हो गई",
    body: "इस पेज पर एक अप्रत्याशित समस्या आई — यह दर्ज कर ली गई है। कृपया फिर कोशिश करें, या होम पेज पर लौटें।",
    retry: "फिर कोशिश करें",
    home: "होम पेज पर जाएँ",
  },
  mr: {
    title: "काहीतरी चूक झाली",
    body: "या पानावर एक अप्रत्याशित समस्या आली असून ती नोंदवली गेली आहे. कृपया पुन्हा प्रयत्न करा किंवा मुख्य पानावर जा.",
    retry: "पुन्हा प्रयत्न करा",
    home: "मुख्य पानावर जा",
  },
  kn: {
    title: "ಏದೋ ತಪ್ಪು ಸಂಭವಿಸಿದೆ",
    body: "ಈ ಪುಟದಲ್ಲಿ ಅನಿರೀಕ್ಷಿತ ದೋಷ ಕಂಡುಬಂದಿದೆ — ಅದು ದಾಖಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ.",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    home: "ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ",
  },
  te: {
    title: "ఏదో తప్పు జరిగింది",
    body: "ఈ పేజీలో ఊహించని లోపం వచ్చింది — అది నమోదైంది. దయచేసి మళ్లీ ప్రయత్నించండి, లేదా హోమ్ పేజీకి వెళ్లండి.",
    retry: "మళ్లీ ప్రయత్నించండి",
    home: "హోమ్ పేజీకి వెళ్లండి",
  },
  ta: {
    title: "ஏதோ தவறு நடந்தது",
    body: "இந்தப் பக்கத்தில் எதிர்பாராத பிழை ஏற்பட்டது — பதிவு செய்யப்பட்டது. மீண்டும் முயற்சிக்கவும் அல்லது முகப்புப் பக்கம் செல்லவும்.",
    retry: "மீண்டும் முயற்சிக்கவும்",
    home: "முகப்புப் பக்கம் செல்லவும்",
  },
} as const;

type Lang = keyof typeof COPY;

function browserLang(): Lang {
  const cookie =
    typeof document === "undefined"
      ? undefined
      : document.cookie
          .split("; ")
          .find((c) => c.startsWith("NEXT_LOCALE="))
          ?.slice("NEXT_LOCALE=".length);
  const guess = cookie || navigator.language?.slice(0, 2) || "en";
  return guess in COPY ? (guess as Lang) : "en";
}

const ink = {
  bg: "#0A3620",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.75)",
  gold: "#D9A93C",
  line: "rgba(255,255,255,0.25)",
} as const;

const button: React.CSSProperties = {
  display: "inline-block",
  borderRadius: 2,
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 600,
  fontFamily: "inherit",
  cursor: "pointer",
  border: "none",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is what the host's logs are keyed on — surfacing the ID
    // gives a real report a handle. The message itself is never rendered:
    // it can carry internals.
    console.error(error);
  }, [error]);

  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => setLang(browserLang()), []);
  const t = COPY[lang];

  return (
    <html lang={lang}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: ink.bg,
          color: ink.text,
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <main
          style={{
            maxWidth: 640,
            padding: "72px 24px",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 56,
              fontWeight: 700,
              color: ink.gold,
              lineHeight: 1,
            }}
          >
            500
          </p>
          <h1 style={{ margin: "16px 0 0", fontSize: 28, fontWeight: 700 }}>
            {t.title}
          </h1>
          <p
            style={{
              margin: "16px auto 0",
              maxWidth: "42ch",
              color: ink.muted,
            }}
          >
            {t.body}
          </p>

          <div
            style={{
              marginTop: 36,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{ ...button, background: ink.gold, color: "#1A1A1A" }}
            >
              {t.retry}
            </button>
            <a
              href="/"
              style={{
                ...button,
                color: ink.text,
                border: `1px solid ${ink.line}`,
                background: "rgba(255,255,255,0.05)",
                textDecoration: "none",
              }}
            >
              {t.home}
            </a>
          </div>

          {error.digest && (
            <p
              style={{
                marginTop: 32,
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
