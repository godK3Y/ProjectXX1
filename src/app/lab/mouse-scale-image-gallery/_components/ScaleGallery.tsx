"use client";

import Image from "next/image";
import type { CSSProperties, PointerEvent } from "react";
import { experiments } from "@/lib/experiments";

/**
 * Adapted from olivierlarose/mouse-scale-image-gallery.
 *
 * Rows of two images. Moving the pointer across a row trades width between
 * them, from 66/33 at the left edge to 33/66 at the right.
 *
 * The original eased this with a hand-rolled requestAnimationFrame lerp (with
 * a console.log left in every frame, and a loop nothing cancelled on unmount).
 * Here the pointer only sets one CSS variable, --x (0 to 1); both widths are
 * calc()s of it, and a CSS width transition does the easing.
 *
 * The cards are this lab's own experiments, paired with local images.
 */
const PROJECTS = experiments.slice(0, 8).map((e, i) => ({ ...e, src: `${i + 1}.jpg` }));
const ROWS = [0, 2, 4, 6].map((i) => PROJECTS.slice(i, i + 2));

export default function ScaleGallery() {
  return (
    <main className="min-h-dvh bg-black pt-[5vh] pb-[10vh] text-white">
      <h1 className="max-w-[80%] p-5 text-[5vw] leading-tight font-normal">
        Everything in the lab so far, two at a time.
      </h1>
      {ROWS.map((row, r) => (
        <Row key={r} projects={row} reversed={r % 2 === 1} />
      ))}
    </main>
  );
}

function Row({
  projects,
  reversed,
}: {
  projects: typeof PROJECTS;
  reversed: boolean;
}) {
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) =>
    e.currentTarget.style.setProperty("--x", String(e.clientX / window.innerWidth));

  return (
    <div
      onPointerMove={onPointerMove}
      // Alternate rows start with the big image on the right.
      style={{ "--x": reversed ? 1 : 0 } as CSSProperties}
      className="mt-[10vh] flex"
    >
      <Card project={projects[0]} width="calc(66.66% - var(--x) * 33.33%)" />
      <Card project={projects[1]} width="calc(33.33% + var(--x) * 33.33%)" />
    </div>
  );
}

function Card({
  project,
  width,
}: {
  project: (typeof PROJECTS)[number];
  width: string;
}) {
  return (
    <div style={{ width }} className="transition-[width] duration-500 ease-out">
      <div className="relative aspect-3/2">
        <Image
          src={`/images/${project.src}`}
          alt=""
          fill
          sizes="66vw"
          className="object-cover"
        />
      </div>
      <div className="p-2.5">
        <h3 className="mb-1 text-[1.2em]">{project.title}</h3>
        <p className="text-zinc-400">{project.tags.join(" · ")}</p>
        <p className="text-zinc-600">{project.status}</p>
      </div>
    </div>
  );
}
