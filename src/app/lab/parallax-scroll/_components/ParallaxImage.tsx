"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import Spacer from "./Spacer";

/**
 * A single full-bleed image that drifts slower than the page — the classic
 * hero parallax, and the opposite construction to the column gallery next
 * door. Gallery slides columns *over* a visible background; here the frame
 * must stay covered at all times, so the image is deliberately taller than
 * its frame and only ever travels within the overhang.
 *
 * The whole thing is percentage-based, which is why there's no resize
 * listener: an image of height (1 + strength) with `top: -strength` starts
 * covering the frame with all its slack above, and travelling down by
 * exactly that slack lands its top edge flush at the bottom of the scroll.
 * Expressed against the image's own height that distance is
 * strength / (1 + strength) — a constant, so nothing needs measuring.
 */
type ParallaxImageProps = {
  /** Filename resolved against /public/images. */
  src: string;
  /** Leave empty for a decorative image. */
  alt?: string;
  /** Any CSS length — the height of the frame you're looking through. */
  height?: string;
  /** Drift distance as a fraction of that height. 0.3 = 30%. */
  strength?: number;
  /** Set for an above-the-fold hero, so it isn't lazy-loaded. */
  priority?: boolean;
  /**
   * Scroll runway above and below, so the drift has room to play out. On by
   * default for viewing the effect on its own; turn it off when dropping this
   * into a real layout, where the surrounding content is the runway.
   */
  spacer?: boolean;
};

export default function ParallaxImage({
  src,
  alt = "",
  height = "100vh",
  strength = 0.3,
  priority = false,
  spacer = true,
}: ParallaxImageProps) {
  const frame = useRef<HTMLDivElement>(null);

  /**
   * 0 when the frame's top edge hits the bottom of the viewport, 1 when its
   * bottom edge leaves the top — the same travel window the gallery uses.
   */
  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${(strength / (1 + strength)) * 100}%`],
  );

  return (
    <>
      {spacer && <Spacer label="scroll" />}

      <div ref={frame} className="relative overflow-hidden" style={{ height }}>
        <motion.div
          style={{
            y,
            height: `${(1 + strength) * 100}%`,
            top: `-${strength * 100}%`,
          }}
          className="absolute inset-x-0"
        >
          <Image
            src={`/images/${src}`}
            alt={alt}
            fill
            sizes="100vw"
            priority={priority}
            className="object-cover"
          />
        </motion.div>
      </div>

      {spacer && <Spacer />}
    </>
  );
}
