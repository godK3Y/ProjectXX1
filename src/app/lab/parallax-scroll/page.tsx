import type { Metadata } from "next";
import Gallery from "./_components/Gallery";

export const metadata: Metadata = {
  title: "Smooth parallax scroll — ProjectXX1",
};

export default function ParallaxScrollPage() {
  return <Gallery />;
}
