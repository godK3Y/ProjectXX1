"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * Adapted from olivierlarose/text-gradient-opacity-on-scroll, which used GSAP.
 * motion was already installed and covers this, so no second animation library.
 *
 * One scroll progress for the whole paragraph; each letter owns a thin slice of
 * it and fades 0.2 -> 1 inside that slice. Letters in order = the "gradient".
 */
export default function TextReveal({ text }: { text: string }) {
  const container = useRef<HTMLParagraphElement>(null);

  // 0 when the paragraph's top reaches 90% down the viewport, 1 at 25%.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  });

  const total = text.replaceAll(" ", "").length;
  let index = 0;

  return (
    // Split letters read as "I, t, i, s" to a screen reader — label the whole
    // sentence once and hide the pieces.
    <p
      ref={container}
      aria-label={text}
      className="flex w-[90%] flex-wrap text-[3.5vw] font-bold text-zinc-300"
    >
      {text.split(" ").map((word, w) => (
        <span key={w} aria-hidden className="mr-[1.5vw]">
          {[...word].map((char, c) => {
            const start = index++ / total;
            return (
              <Letter
                key={c}
                char={char}
                range={[start, start + 1 / total]}
                progress={scrollYProgress}
              />
            );
          })}
        </span>
      ))}
    </p>
  );
}

// Own component so each letter gets its own useTransform — hooks can't run in .map().
function Letter({
  char,
  range,
  progress,
}: {
  char: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}
