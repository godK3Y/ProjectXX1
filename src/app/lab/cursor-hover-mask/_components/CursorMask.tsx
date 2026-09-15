"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * Adapted from olivierlarose/cursor-hover-mask.
 *
 * Two copies of the screen stacked on top of each other. The top one is orange
 * with different text, and a CSS mask cuts it down to a small circle that
 * follows the cursor — so you only ever see it through that hole. Hovering the
 * text grows the hole from 40px to 400px.
 *
 * The original masked with an SVG file; a radial-gradient draws the same
 * circle in CSS with nothing to load.
 */
export default function CursorMask() {
  // Off-screen until the pointer first moves (the original started at null,
  // which made the mask position "NaNpx").
  const [pos, setPos] = useState({ x: -400, y: -400 });
  const [hovered, setHovered] = useState(false);
  const size = hovered ? 400 : 40;

  useEffect(() => {
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const text = "w-[1000px] max-w-full p-10";

  return (
    <main className="relative h-dvh cursor-default overflow-hidden bg-[#0f0f0f] text-[min(64px,8vw)] leading-[1.05]">
      <motion.div
        aria-hidden
        className="absolute inset-0 z-10 flex items-center justify-center bg-[#ec4e39] text-black"
        style={{
          maskImage: "radial-gradient(circle closest-side, #000 98%, transparent)",
          maskRepeat: "no-repeat",
        }}
        animate={{
          maskPosition: `${pos.x - size / 2}px ${pos.y - size / 2}px`,
          maskSize: `${size}px ${size}px`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      >
        <p
          className={text}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          A junior dev who breaks things on purpose, just to see how they were
          put together.
        </p>
      </motion.div>

      <div className="flex h-full items-center justify-center text-[#afa18f]">
        <p className={text}>
          I&apos;m a <span className="text-[#ec4e39]">curious</span> developer
          rebuilding the web effects I like, one experiment at a time.
        </p>
      </div>
    </main>
  );
}
