import type { Metadata } from "next";
import ImageTrail from "./_components/ImageTrail";

export const metadata: Metadata = {
  title: "Mouse image gallery — ProjectXX1",
};

export default function MouseImageGalleryPage() {
  return <ImageTrail />;
}
