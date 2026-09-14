"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * Adapted from olivierlarose/smooth-parallax-scroll (2023).
 *
 * The idea: columns of images, each translated vertically at a different rate
 * as the gallery crosses the viewport. Different rates = parallax. Lenis,
 * mounted by the page, adds momentum to the scroll itself, which is what makes
 * it feel "smooth" rather than stepped.
 */
const DEFAULT_IMAGES = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
];

/**
 * Per-column motion, cycled when there are more columns than entries.
 *
 * `speed` multiplies the viewport height to decide how far a column travels
 * over the full scroll. `top` pre-lifts the column so it has somewhere to
 * travel from — without it the columns would start aligned and only ever
 * slide down. The two were tuned by eye and neither is derivable from the
 * other, so they stay as data rather than a formula.
 */
const PACES = [
  { speed: 1.5, top: "-45%" },
  { speed: 3.3, top: "-95%" },
  { speed: 1.25, top: "-45%" },
  { speed: 2.2, top: "-75%" },
];

type GalleryProps = {
  /** Filenames resolved against /public/images. */
  images?: string[];
  /** How many columns to spread the images across. 1 gives a single strip. */
  cols?: number;
  /**
   * "parallax" drifts each column at its own rate. "grid" holds them still at
   * natural height — the control case for what the motion is buying.
   */
  type?: "parallax" | "grid";
};

export default function Gallery({
  images = DEFAULT_IMAGES,
  cols = 4,
  type = "parallax",
}: GalleryProps) {
  const gallery = useRef<HTMLDivElement>(null);

  /**
   * 0 when the gallery's top edge hits the bottom of the viewport, 1 when its
   * bottom edge leaves the top. That's the window we animate across.
   */
  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const isParallax = type === "parallax";
  const columnCount = Math.max(1, Math.floor(cols));
  const columns = distribute(images, columnCount);

  return (
    <div
      ref={gallery}
      className={`relative flex gap-[2vw] overflow-hidden bg-[#2d2d2d] p-[2vw] ${
        isParallax ? "h-[175vh]" : "h-auto"
      }`}
    >
      {columns.map((columnImages, index) => {
        const pace = PACES[index % PACES.length];

        return (
          <Column
            key={index}
            images={columnImages}
            speed={isParallax ? pace.speed : 0}
            top={isParallax ? pace.top : "0%"}
            fillHeight={isParallax}
            sizes={`(max-width: 768px) 50vw, ${Math.round(100 / columnCount)}vw`}
            scrollYProgress={scrollYProgress}
          />
        );
      })}
    </div>
  );
}

function Column({
  images,
  speed,
  top,
  fillHeight,
  sizes,
  scrollYProgress,
}: {
  images: string[];
  speed: number;
  top: string;
  fillHeight: boolean;
  sizes: string;
  scrollYProgress: MotionValue<number>;
}) {
  /**
   * This hook lives in Column, not the parent, on purpose — hooks can't be
   * called inside a .map(), so the original had to declare y/y2/y3/y4 by hand
   * up top. Giving each column its own component means each one gets its own
   * hook call legally, which is what lets the column count become a prop.
   *
   * Travel is in vh, so the browser resolves it against the viewport — no
   * measuring, no resize listener, and it's right on the first frame.
   */
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", `${speed * 100}vh`]);

  return (
    <motion.div
      style={{ y, top }}
      className="relative flex h-full min-w-[250px] flex-1 flex-col gap-[2vw]"
    >
      {images.map((src) => (
        <div
          key={src}
          className={`relative w-full overflow-hidden rounded-[1vw] ${
            fillHeight ? "h-full" : "aspect-3/4"
          }`}
        >
          <Image
            src={`/images/${src}`}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      ))}
    </motion.div>
  );
}

/**
 * Spread images across `count` columns, filling left to right and keeping the
 * columns within one image of each other. 12 over 4 gives the original
 * 3/3/3/3; 12 over 5 gives 3/3/2/2/2 rather than the empty trailing column a
 * fixed-size chunk would leave.
 */
function distribute<T>(items: T[], count: number): T[][] {
  const columns: T[][] = [];
  let start = 0;

  for (let i = 0; i < count; i++) {
    const size = Math.ceil((items.length - start) / (count - i));
    columns.push(items.slice(start, start + size));
    start += size;
  }

  return columns;
}
