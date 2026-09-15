import type { Metadata } from "next";
import TextReveal from "./_components/TextReveal";

export const metadata: Metadata = {
  title: "Text opacity on scroll — ProjectXX1",
};

const PHRASE =
  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.";

export default function TextOpacityScrollPage() {
  return (
    <main className="bg-black">
      <div className="flex h-dvh items-center justify-center font-mono text-xs tracking-widest text-zinc-500 uppercase">
        scroll ↓
      </div>
      <div className="flex justify-center">
        <TextReveal text={PHRASE} />
      </div>
      <div className="h-dvh" />
    </main>
  );
}
