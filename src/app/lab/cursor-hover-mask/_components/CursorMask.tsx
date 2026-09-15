"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";

/**
 * Adapted from olivierlarose/cursor-hover-mask.
 *
 * Two copies of the screen stacked on top of each other. The top one is a
 * solid accent color with different text, and a CSS mask cuts it down to a
 * small circle that follows the cursor — so you only ever see it through that
 * hole. Hovering the text grows the hole from 40px to 400px.
 *
 * The original masked with an SVG file; a radial-gradient draws the same
 * circle in CSS with nothing to load.
 */

/**
 * One is picked per visit. `visible` is [before, accent word, after]; `hidden`
 * is what shows through the mask. `ink` is the hidden text's color, drawn on
 * top of `accent`.
 */
const VARIANTS = [
  {
    visible: ["I'm a ", "curious", " developer rebuilding the web effects I like, one experiment at a time."],
    hidden: "A junior dev who breaks things on purpose, just to see how they were put together.",
    background: "#0f0f0f",
    text: "#afa18f",
    accent: "#ec4e39",
    ink: "#000000",
  },
  {
    visible: ["Every bug is a ", "lesson", " I didn't know I signed up for."],
    hidden: "Every bug is a lesson I'd happily have skipped. And yet, here we are.",
    background: "#0b1d2a",
    text: "#9fb3c8",
    accent: "#f2c14e",
    ink: "#0b1d2a",
  },
  {
    visible: ["Good code is ", "boring", ". Good motion is anything but."],
    hidden: "Keep the code boring so the animations get to have all the fun.",
    background: "#f4efe6",
    text: "#8a7f70",
    accent: "#1f3d2b",
    ink: "#f4efe6",
  },
  {
    visible: ["I read the docs ", "after", " it breaks, like everyone else."],
    hidden: "Okay, sometimes before. Mostly after. Honestly? Always after.",
    background: "#1a1030",
    text: "#b7a8d6",
    accent: "#7cf5c4",
    ink: "#1a1030",
  },
  {
    visible: ["Ship it ", "ugly", ", then make it beautiful."],
    hidden: "Nobody sees the first draft. Everybody sees the one you finished.",
    background: "#fff5f7",
    text: "#b08a93",
    accent: "#d6336c",
    ink: "#ffffff",
  },
  {
    visible: ["Small experiments, ", "big", " curiosity."],
    hidden: "Twelve tiny demos teach more than one giant plan that never ships.",
    background: "#101a14",
    text: "#8fa89a",
    accent: "#e8e3d3",
    ink: "#101a14",
  },
];

const LAST_KEY = "cursor-hover-mask:last";

/**
 * Random variant, never the same as the previous visit's: step 1 to 5 places
 * past the last one, wrapping around. Only reads; the pick is saved once it's
 * actually on screen.
 */
function pickVariant() {
  let last = -1;
  try {
    last = Number(localStorage.getItem(LAST_KEY) ?? -1);
  } catch {}
  return (last + 1 + Math.floor(Math.random() * (VARIANTS.length - 1))) % VARIANTS.length;
}

const noopSubscribe = () => () => {};

export default function CursorMask() {
  // A fresh pick per mount, so every visit or refresh gets a new one. The
  // server makes its own pick too, so nothing variant-specific renders until
  // `mounted` — otherwise the two picks would disagree during hydration.
  const [index] = useState(pickVariant);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Off-screen until the pointer first moves (the original started at null,
  // which made the mask position "NaNpx").
  const [pos, setPos] = useState({ x: -400, y: -400 });
  const [hovered, setHovered] = useState(false);
  const size = hovered ? 400 : 40;

  useEffect(() => {
    try {
      localStorage.setItem(LAST_KEY, String(index));
    } catch {}
  }, [index]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!mounted) return <main className="h-dvh" />;

  const v = VARIANTS[index];
  const text = "w-[1000px] max-w-full p-10";

  return (
    <main
      className="relative h-dvh cursor-default overflow-hidden text-[min(64px,8vw)] leading-[1.05]"
      style={{ backgroundColor: v.background }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{
          backgroundColor: v.accent,
          color: v.ink,
          maskImage: "radial-gradient(circle closest-side, #000 98%, transparent)",
          maskRepeat: "no-repeat",
        }}
        initial={false}
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
          {v.hidden}
        </p>
      </motion.div>

      <div
        className="flex h-full items-center justify-center"
        style={{ color: v.text }}
      >
        <p className={text}>
          {v.visible[0]}
          <span style={{ color: v.accent }}>{v.visible[1]}</span>
          {v.visible[2]}
        </p>
      </div>
    </main>
  );
}
