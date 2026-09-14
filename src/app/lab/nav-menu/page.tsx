import type { Metadata } from "next";
import Image from "next/image";
import Header from "./_components/Header";

export const metadata: Metadata = {
  title: "Nav menu — ProjectXX1",
};

/** A full-screen photo under the header, so the dimming backdrop has something to dim. */
export default function NavMenuPage() {
  return (
    <>
      <Header />
      <main className="relative h-dvh">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          className="object-cover"
        />
      </main>
    </>
  );
}
