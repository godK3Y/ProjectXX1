import type { Metadata } from "next";
import Gallery from "./_components/Gallery";
import ParallaxImage from "./_components/ParallaxImage";

export const metadata: Metadata = {
  title: "Smooth parallax scroll — ProjectXX1",
};

export default function ParallaxScrollPage() {
  // return <Gallery images={["image1.jpg"]}/>;
  return <ParallaxImage src="1.jpg" /> ;
}
