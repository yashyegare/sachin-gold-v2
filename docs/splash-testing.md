# Splash behavior and regression checks

The brand splash runs on the first homepage visit per browser and origin. Completion stores `sg-splash-seen=1` in localStorage. Refreshes, later visits and new tabs skip it. Clearing site storage replays it. Internal pages do not consume the first homepage visit. If storage is blocked, playback remains safe but cannot be remembered. Reduced-motion visitors skip the splash.

CSS controls the full 4.7-second timeline (4-second hold/assembly, 0.7-second exit), independently of hydration. The initial inline script observes completion even when bundles are delayed or unavailable. The React effect uses the current CSS animation time for its fallback and cleans up on unmount, so stale timers cannot dismiss a replacement overlay. Ordinary pointer and keyboard input no longer shortens playback. The language card waits until the splash finishes.

## Run checks

1. `npm ci`
2. `npx playwright install chromium`
3. `npm run build`, then `npm run start -- --port 3100` (or use `npm run dev -- --port 3100` to exercise StrictMode).
4. In another terminal: `npm run test:splash`.

Set `SPLASH_TEST_URL` to test another server. The test creates fresh browser contexts, so it does not alter your normal browser's stored visit status.

Coverage: desktop first visit, incidental input, reload, mobile Marathi homepage, returning visitor, reduced motion, internal page, blocked storage, six-second delayed hydration, and unavailable JavaScript bundles. It measures visible time, checks one completion event, verifies persisted completion where storage works, and confirms the language card does not overlap the splash.

## Observed production failure before the change

On https://sachin-gold-v2.vercel.app, a fresh Chromium page showed the overlay for approximately 270ms and logged React hydration recovery errors. The prior component used a module-wide `started` flag and an unmount-surviving 4000ms timer, disconnected from the visible CSS clock. A recovered/remounted overlay could therefore be removed by the earlier instance's timer. Any pointer/key input also offered an independent 370ms exit. There was no persisted first-visit check.
