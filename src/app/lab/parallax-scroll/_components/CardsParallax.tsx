"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * Adapted from olivierlarose/cards-parallax. The card copy here explains the
 * effect itself — the original's text and photos were someone else's.
 */
const CARDS = [
  {
    title: "Sticky",
    description:
      "Every card sits in its own 100vh container with position: sticky, so it pins while the next card scrolls up over it.",
    src: "8.jpg",
    color: "#BBACAF",
  },
  {
    title: "Scale down",
    description:
      "As the stack grows, earlier cards shrink toward a target scale: the first ends at 75%, the last at 95%.",
    src: "9.jpg",
    color: "#977F6D",
  },
  {
    title: "Staggered start",
    description:
      "Card i only starts shrinking at i × 25% of the scroll, so the cards settle one after another instead of all at once.",
    src: "10.jpg",
    color: "#C2491D",
  },
  {
    title: "Offset tops",
    description:
      "Each card sits 25px lower than the one before, so the edges of the cards underneath keep peeking out.",
    src: "11.jpg",
    color: "#B62429",
  },
  {
    title: "Image zoom",
    description:
      "Inside each card the photo starts at 2× and eases down to 1× as the card arrives.",
    src: "12.jpg",
    color: "#88A28D",
  },
];

export default function CardsParallax() {
  const container = useRef<HTMLDivElement>(null);

  // Progress across the whole stack drives the shrinking.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container} className="relative">
      {CARDS.map((card, i) => (
        <Card
          key={card.title}
          {...card}
          i={i}
          progress={scrollYProgress}
          range={[i * 0.25, 1]}
          targetScale={1 - (CARDS.length - i) * 0.05}
        />
      ))}
    </div>
  );
}

function Card({
  i,
  title,
  description,
  src,
  color,
  progress,
  range,
  targetScale,
}: (typeof CARDS)[number] & {
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) {
  const container = useRef<HTMLDivElement>(null);

  // Per-card progress (card entering the viewport) drives the image zoom.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="sticky top-0 flex h-dvh items-center justify-center">
      <motion.div
        style={{ backgroundColor: color, scale, top: `calc(-5vh + ${i * 25}px)` }}
        className="relative flex h-[500px] w-[min(1000px,90vw)] origin-top flex-col rounded-[25px] p-[50px]"
      >
        <h2 className="text-center text-[28px] font-semibold">{title}</h2>
        <div className="mt-[50px] flex h-full gap-[50px]">
          <p className="relative top-[10%] w-2/5">{description}</p>
          <div className="relative h-full w-3/5 overflow-hidden rounded-[25px]">
            <motion.div style={{ scale: imageScale }} className="relative size-full">
              <Image src={`/images/${src}`} alt="" fill sizes="600px" className="object-cover" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
