import type { Metadata } from "next";
import CursorMask from "./_components/CursorMask";

export const metadata: Metadata = {
  title: "Cursor hover mask — ProjectXX1",
};

export default function CursorHoverMaskPage() {
  return <CursorMask />;
}
