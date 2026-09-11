"use client";

import { useEffect, useState } from "react";

/**
 * The three things that matter in almost every experiment you'll build:
 *
 *   1. 'use client' at the top — required for useState, useEffect, refs,
 *      and any browser-only library.
 *   2. Guard against the server — this component still renders once on the
 *      server, where `window` does not exist. Read browser values inside
 *      useEffect, never during render.
 *   3. Clean up — the `return () => ...` removes the listener. Skip it and
 *      you stack a new listener every hot reload until the page crawls.
 */
export default function PointerTrail() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function onMove(event: PointerEvent) {
      setPos({ x: event.clientX, y: event.clientY });
    }

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      <p className="font-mono text-sm text-zinc-400">
        {pos
          ? `${Math.round(pos.x)} , ${Math.round(pos.y)}`
          : "move the pointer"}
      </p>

      {pos && (
        <div
          aria-hidden
          // `left-0 top-0` is load-bearing. A `fixed` element with no offsets
          // anchors to its *static* position — where it would have sat in
          // normal flow — so translate() would stack on top of that and throw
          // the circle off-screen. Pinning it to the origin makes the
          // translate values plain viewport coordinates.
          className="pointer-events-none fixed left-0 top-0 -ml-3 -mt-3 h-6 w-6 rounded-full border border-zinc-900"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        />
      )}
    </>
  );
}
