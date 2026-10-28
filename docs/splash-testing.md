# Splash behavior and regression checks

The brand splash runs on the first homepage visit per browser and origin. Completion stores `sg-splash-seen=1` in localStorage. Refreshes, later visits and new tabs skip it. Clearing site storage replays it. Internal pages do not consume the first homepage visit. If storage is blocked, playback remains safe but cannot be remembered. Reduced-motion visitors skip the splash.

CSS controls the full 4.7-second timeline (4-second hold/assembly, 0.7-second exit), independently of hydration. The initial inline script observes completion even when bundles are delayed or unavailable. The React effect restores the active flag after full-root hydration recovery, preserves elapsed animation time, and cleans up its fallback on unmount. Ordinary pointer and keyboard input no longer shortens playback. The language card waits until the splash finishes.

## Run checks

1. `npm ci`
2. `npx playwright install chromium`
3. `npm run build`, then `npm run start -- --port 3100`.
4. In another terminal: `npm run test:splash`.

Set `SPLASH_TEST_URL` to test another server. The test creates fresh browser contexts, so it does not alter your normal browser's stored visit status.

Coverage: desktop first visit, incidental input, reload, mobile Marathi homepage, returning visitor, reduced motion, internal page, blocked storage, six-second delayed hydration, and unavailable JavaScript bundles. It measures visible time, checks one completion event, verifies persisted completion where storage works, and confirms the language card does not overlap the splash.

## Observed production failure before the change

On https://sachin-gold-v2.vercel.app, a fresh Chromium page showed the overlay for approximately 270ms and logged React hydration recovery errors. Full-root hydration recovery replaced the document attribute that makes the splash visible. The prior component also used a module-wide `started` flag and an unmount-surviving 4000ms timer, disconnected from the visible CSS clock. A recovered/remounted overlay could therefore be removed by the earlier instance's timer. Any pointer/key input also offered an independent 370ms exit. There was no persisted first-visit check.

## Validation result

Production build (118 pages), lint, and all eight browser scenarios passed. Measured production visibility was approximately 4.74–4.98 seconds, including delayed/unavailable bundles. Ordinary first-visit/reload and locale cases also passed in development StrictMode. Run the complete delay/failure suite against the production server: development mode delivers CSS through JavaScript and delaying those scripts changes when the CSS timeline becomes available. Existing production React hydration recovery errors are still present elsewhere on the page; this change keeps the splash stable through that recovery.
