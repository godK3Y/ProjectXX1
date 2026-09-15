import type { Metadata } from "next";
import ScaleGallery from "./_components/ScaleGallery";

export const metadata: Metadata = {
  title: "Mouse scale image gallery — ProjectXX1",
};

export default function MouseScaleImageGalleryPage() {
  return <ScaleGallery />;
}
