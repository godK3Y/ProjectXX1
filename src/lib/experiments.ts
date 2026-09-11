export type Experiment = {
  /** URL segment — must match the folder name under `src/app/lab/`. */
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  /**
   * "idea" entries show on the index as a greyed-out backlog item and are not
   * clickable — there's no route for them yet. Flip to "wip" or "done" once
   * `src/app/lab/<slug>/page.tsx` exists.
   */
  status: "idea" | "wip" | "done";
};

export const experiments: Experiment[] = [
  {
    slug: "hello",
    title: "Hello, client",
    blurb:
      "Pointer tracking in 20 lines. Exists to prove the wiring works and to show the server/client split. Copy this folder to start a new experiment, or delete it.",
    tags: ["basics"],
    status: "done",
  },
  {
    slug: "parallax-scroll",
    title: "Smooth parallax scroll",
    blurb:
      "Four columns of images travelling at different speeds as you scroll, over Lenis momentum scrolling. Adapted from olivierlarose/smooth-parallax-scroll.",
    tags: ["scroll", "motion", "lenis"],
    status: "done",
  },
  {
    slug: "map-journey",
    title: "Scroll-driven map journey",
    blurb:
      "Map flies between coordinates as you scroll. GSAP ScrollTrigger driving MapLibre's flyTo.",
    tags: ["map", "gsap", "scroll"],
    status: "idea",
  },
  {
    slug: "scroll-scrub",
    title: "Frame-sequence scroll video",
    blurb:
      "The Apple product-page effect. A sequence of frames drawn to canvas, scrubbed by scroll position.",
    tags: ["video", "canvas", "scroll"],
    status: "idea",
  },
  {
    slug: "places-slider",
    title: "Places slider",
    blurb:
      "Swiper of photos where picking a slide flies the map to that location. Two components talking to each other.",
    tags: ["swiper", "map"],
    status: "idea",
  },
];

export function getExperiment(slug: string) {
  return experiments.find((e) => e.slug === slug);
}
