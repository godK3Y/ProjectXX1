# components

**Only for things shared across two or more experiments.** Empty is fine — and
correct — until something actually gets reused. Don't move code here "in case."

An experiment's own components live next to the experiment, in
`src/app/lab/<slug>/_components/`. The `_` prefix makes the folder
non-routable, so Next.js won't try to turn it into a URL. Keeping everything in
one folder means deleting the experiment deletes all of it, with nothing left
behind.

## Adding an experiment

1. `cp -r src/app/lab/hello src/app/lab/your-thing`
2. Add it to `src/lib/experiments.ts` (set `status` to `"wip"` so the index
   links to it)
3. Build

## Things worth knowing

**Most of this needs `'use client'`.** Anything touching `window`, `document`,
a `ref`, `useState`/`useEffect`, or a browser-only library (MapLibre, GSAP,
Swiper) needs `'use client'` on the first line. Components are Server
Components by default in the App Router — this is the single biggest gotcha.

**`metadata` can't be exported from a client component.** That's why `hello`
splits into a server `page.tsx` and a client `PointerTrail.tsx`. Copy that
shape.

**Some libraries can't be server-rendered at all.** Leaflet reads `window`
while it's being imported, so `'use client'` isn't enough — it also needs a
dynamic import with `ssr: false`. If you get "window is not defined" pointing
at an import line, that's this.

**Clean up after yourself.** Map instances, GSAP timelines, and event
listeners get torn down in the `useEffect` cleanup function, or they stack up
on every hot reload. For GSAP, the `useGSAP()` hook from `@gsap/react` does
this for you.
