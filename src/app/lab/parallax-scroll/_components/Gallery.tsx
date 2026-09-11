"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ReactLenis } from "lenis/react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import "lenis/dist/lenis.css";

/**
 * Adapted from olivierlarose/smooth-parallax-scroll (2023).
 *
 * The idea: four columns of images, each translated vertically at a different
 * rate as the gallery crosses the viewport. Different rates = parallax. Lenis
 * adds momentum to the scroll itself, which is what makes it feel "smooth"
 * rather than stepped.
 *
 * `speed` multiplies the viewport height to decide how far a column travels
 * over the full scroll. `top` pre-lifts the column so it has somewhere to
 * travel from — without it the columns would start aligned and only ever
 * slide down.
 */
const COLUMNS = [
  { images: ["1.jpg", "2.jpg", "3.jpg"], speed: 4, top: "-45%" },
  { images: ["4.jpg", "5.jpg", "6.jpg"], speed: 3.3, top: "-95%" },
  { images: ["7.jpg", "8.jpg", "9.jpg"], speed: 1.25, top: "-45%" },
  { images: ["10.jpg", "11.jpg", "12.jpg"], speed: 1, top: "-75%" },
];

export default function Gallery() {
  const gallery = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  /**
   * 0 when the gallery's top edge hits the bottom of the viewport, 1 when its
   * bottom edge leaves the top. That's the window we animate across.
   */
  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    /**
     * The original ran its own requestAnimationFrame loop calling lenis.raf().
     * It never cancelled that loop or destroyed the instance, so navigating
     * away left Lenis hijacking scroll on every other page. <ReactLenis> owns
     * the loop and tears it down on unmount — the leak goes away by deleting
     * the code that caused it.
     */
    <ReactLenis root>
      <Spacer label="scroll" />

      <div
        ref={gallery}
        className="relative flex h-[175vh] gap-[2vw] overflow-hidden bg-[#2d2d2d] p-[2vw]"
      >
        {COLUMNS.map((column) => (
          <Column
            key={column.images[0]}
            images={column.images}
            speed={column.speed}
            top={column.top}
            scrollYProgress={scrollYProgress}
            viewportHeight={viewportHeight}
          />
        ))}
      </div>

      <Spacer />
    </ReactLenis>
  );
}

function Column({
  images,
  speed,
  top,
  scrollYProgress,
  viewportHeight,
}: {
  images: string[];
  speed: number;
  top: string;
  scrollYProgress: MotionValue<number>;
  viewportHeight: number;
}) {
  /**
   * This hook lives in Column, not the parent, on purpose — hooks can't be
   * called inside a .map(), so the original had to declare y/y2/y3/y4 by hand
   * up top. Giving each column its own component means each one gets its own
   * hook call legally, and adding a fifth column is a one-line data change.
   *
   * viewportHeight is 0 on the first render (there's no window on the server).
   * That just means no movement for one frame, until the effect measures.
   */
  const y = useTransform(scrollYProgress, [0, 1], [0, viewportHeight * speed]);

  return (
    <motion.div
      style={{ y, top }}
      className="relative flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw]"
    >
      {images.map((src) => (
        <div
          key={src}
          className="relative h-full w-full overflow-hidden rounded-[1vw]"
        >
          <Image
            src={`/images/${src}`}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      ))}
    </motion.div>
  );
}

function Spacer({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center">
      {label && (
        <span className="font-mono text-[80px] tracking-widest text-zinc-900 uppercase">
          {label} ↓
        </span>
      )}
    </div>
  );
}
