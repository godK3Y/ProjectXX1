import type { Metadata } from "next";
import PointerTrail from "./_components/PointerTrail";

/**
 * This is a Server Component (no 'use client' at the top).
 *
 * That's why it can export `metadata` — client components can't. The usual
 * shape for an experiment: a thin server page that owns the metadata, wrapping
 * a client component that owns the interactivity.
 */
export const metadata: Metadata = {
  title: "Hello, client — ProjectXX1",
};

export default function HelloPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <PointerTrail />
    </main>
  );
}
