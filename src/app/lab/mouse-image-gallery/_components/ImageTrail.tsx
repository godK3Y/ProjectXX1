"use client";

import { useRef } from "react";
import Image from "next/image";

/**
 * Adapted from olivierlarose/mouse-image-gallery (2023).
 *
 * Every STEP pixels of pointer travel, the next photo drops at the pointer on
 * top of the rest, and the photo dropped VISIBLE steps ago is hidden, so a
 * trail of VISIBLE photos follows you. Positions go straight to the DOM:
 * routing them through state would re-render on every pointermove for nothing.
 */
const IMAGES = Array.from({ length: 12 }, (_, i) => `${i + 1}.jpg`);
const STEP = 150;
/** Keep below IMAGES.length, or the photo being dropped is also the one hidden. */
const VISIBLE = 8;

export default function ImageTrail() {
  const images = useRef<(HTMLImageElement | null)[]>([]);

  /**
   * The original kept these as plain `let`s in the component body, which reset
   * on any re-render, and called useRef inside .map(), which breaks the rules
   * of hooks. One ref holds the counters; one callback ref per image fills the
   * array.
   */
  const trail = useRef({ distance: 0, next: 0, z: 0, lastX: 0, lastY: 0 });

  function onPointerMove({ clientX: x, clientY: y }: { clientX: number; clientY: number }) {
    const t = trail.current;

    t.distance += Math.abs(x - t.lastX) + Math.abs(y - t.lastY);
    t.lastX = x;
    t.lastY = y;
    if (t.distance < STEP) return;
    t.distance = 0;

    const count = IMAGES.length;
    const oldest = images.current[(t.next - VISIBLE + count) % count];
    const image = images.current[t.next];

    if (oldest) oldest.style.display = "none";
    if (image) {
      image.style.left = `${x}px`;
      image.style.top = `${y}px`;
      // ponytail: z only ever climbs; hitting the CSS max takes ~85,000 km of pointer travel.
      image.style.zIndex = String(++t.z);
      image.style.display = "block";
    }

    t.next = (t.next + 1) % count;
  }

  return (
    // `isolate` keeps the climbing z-indexes inside this box, so they never
    // cover the lab layout's fixed "← index" link. `touch-none` lets a finger
    // drag draw the trail instead of scrolling the page.
    <main
      onPointerMove={onPointerMove}
      className="relative isolate h-dvh touch-none overflow-hidden"
    >
      <p className="absolute inset-0 flex items-center justify-center font-mono text-sm text-zinc-400">
        move the pointer
      </p>

      {IMAGES.map((src, index) => (
        <Image
          key={src}
          ref={(element) => {
            images.current[index] = element;
          }}
          src={`/images/${src}`}
          alt=""
          width={600}
          height={800}
          sizes="30vw"
          // Hidden images never scroll into view, so lazy ones would only start
          // loading at the moment they're dropped, and pop in blank.
          loading="eager"
          className="absolute hidden h-auto w-[30vw] -translate-x-1/2 -translate-y-1/2"
        />
      ))}
    </main>
  );
}
