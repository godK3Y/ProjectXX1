import type { Metadata } from "next";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import Gallery from "./_components/Gallery";
import ParallaxImage from "./_components/ParallaxImage";
import Spacer from "./_components/Spacer";
import ZoomParallax from "./_components/ZoomParallax";

export const metadata: Metadata = {
  title: "Smooth parallax scroll — ProjectXX1",
};

/**
 * One section per parallax style. Lenis and the scroll runway live here, not in
 * the components, so each component is only its effect and any number of them
 * can share the page. Adding a style is a labelled Spacer plus the component.
 *
 * <ReactLenis> owns its requestAnimationFrame loop and tears it down on
 * unmount. The original gallery ran that loop by hand and never stopped it, so
 * Lenis kept hijacking scroll on every page you navigated to afterwards.
 */
export default function ParallaxScrollPage() {
  return (
    <ReactLenis root>
      <Spacer label="columns" />
      <Gallery />
      <Spacer label="hero image" />
      <ParallaxImage src="hero.jpg" />
      <Spacer label="zoom" />
      <ZoomParallax />
      <Spacer />
    </ReactLenis>
  );
}
