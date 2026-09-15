"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * Adapted from olivierlarose/zoom-parallax.
 *
 * Seven images pinned in a sticky 100vh frame while you scroll through 300vh.
 * Every image scales up from the viewport centre; the outer ones scale more,
 * so they fly off-screen first while the centre one grows to fill the frame.
 *
 * The original placed images with seven `&:nth-of-type(n)` CSS rules. Here the
 * layout is data next to the scale it belongs with.
 */
const PICTURES = [
  { src: "1.jpg", scale: 4, top: "0vh", left: "0vw", width: "25vw", height: "25vh" },
  { src: "2.jpg", scale: 5, top: "-30vh", left: "5vw", width: "35vw", height: "30vh" },
  { src: "3.jpg", scale: 6, top: "-10vh", left: "-25vw", width: "20vw", height: "45vh" },
  { src: "4.jpg", scale: 5, top: "0vh", left: "27.5vw", width: "25vw", height: "25vh" },
  { src: "5.jpg", scale: 6, top: "27.5vh", left: "5vw", width: "20vw", height: "25vh" },
  { src: "6.jpg", scale: 8, top: "27.5vh", left: "-22.5vw", width: "30vw", height: "25vh" },
  { src: "7.jpg", scale: 9, top: "22.5vh", left: "25vw", width: "15vw", height: "15vh" },
];

export default function ZoomParallax() {
  const container = useRef<HTMLDivElement>(null);

  // 0 when the section's top hits the viewport top, 1 when its bottom hits the
  // viewport bottom — exactly the stretch the sticky frame stays pinned.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        {PICTURES.map((picture) => (
          <Picture key={picture.src} {...picture} progress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}

function Picture({
  src,
  scale,
  top,
  left,
  width,
  height,
  progress,
}: (typeof PICTURES)[number] & { progress: MotionValue<number> }) {
  const s = useTransform(progress, [0, 1], [1, scale]);

  // The scaled layer is full-viewport and centred, so every image zooms around
  // the screen centre rather than its own — that's what makes them fly apart.
  return (
    <motion.div
      style={{ scale: s }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative" style={{ top, left, width, height }}>
        <Image src={`/images/${src}`} alt="" fill sizes="35vw" className="object-cover" />
      </div>
    </motion.div>
  );
}
