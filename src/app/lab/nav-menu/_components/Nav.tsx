"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { experiments } from "@/lib/experiments";
import { blur, height, opacity, translate } from "./anim";

/**
 * The original pointed at /shop, /about and friends, which don't exist here.
 * So the lab is the menu: the index plus every experiment that has a route,
 * each paired with one of the gallery images for the hover preview.
 */
const links = [
  { title: "index", href: "/" },
  ...experiments
    .filter((experiment) => experiment.status !== "idea")
    .map((experiment) => ({
      title: experiment.slug.replace(/-/g, " "),
      href: `/lab/${experiment.slug}`,
    })),
].map((link, index) => ({ ...link, src: `${(index % 12) + 1}.jpg` }));

const credits = [
  ["Adapted from", "olivierlarose/nav-menu"],
  ["Images", "rawpixel, StockSnap, Unsplash"],
  ["Built with", "Next.js, Motion"],
];

export default function Nav() {
  const [selected, setSelected] = useState({ isActive: false, index: 0 });

  return (
    <motion.nav
      id="nav-menu"
      variants={height}
      initial="initial"
      animate="enter"
      exit="exit"
      className="overflow-hidden"
    >
      <div className="mb-20 flex gap-[50px] lg:mb-0 lg:justify-between">
        <div className="flex flex-col justify-between">
          <div className="mt-10 flex flex-wrap lg:mt-20 lg:max-w-[1200px]">
            {links.map((link, index) => (
              <Link key={link.href} href={link.href} className="uppercase text-black">
                <motion.p
                  onMouseOver={() => setSelected({ isActive: true, index })}
                  onMouseLeave={() => setSelected({ isActive: false, index })}
                  variants={blur}
                  animate={
                    selected.isActive && selected.index !== index ? "open" : "closed"
                  }
                  className="flex overflow-hidden pt-2.5 pr-[30px] text-[32px] font-light lg:pr-[2vw] lg:text-[5vw]"
                >
                  {getChars(link.title)}
                </motion.p>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-end text-xs uppercase lg:justify-between">
            {credits.map(([label, value]) => (
              <ul key={label} className="mt-2.5 w-1/2 overflow-hidden lg:w-auto">
                <motion.li
                  custom={[0.3, 0]}
                  variants={translate}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                >
                  <span className="text-[#9f9689]">{label}: </span>
                  {value}
                </motion.li>
              </ul>
            ))}
          </div>
        </div>

        <motion.div
          variants={opacity}
          initial="initial"
          animate={selected.isActive ? "open" : "closed"}
          className="relative hidden h-[450px] w-[500px] shrink-0 lg:block"
        >
          <Image
            src={`/images/${links[selected.index].src}`}
            alt=""
            fill
            sizes="500px"
            className="object-cover"
          />
        </motion.div>
      </div>
    </motion.nav>
  );
}

/**
 * One span per letter, each rising out of the line's overflow-hidden edge.
 * The delays stagger left to right on the way in and right to left on the
 * way out. Spaces become non-breaking: a span holding only " " is a flex item
 * with nothing but collapsible whitespace, so it would shrink to zero width.
 */
function getChars(word: string) {
  return word.split("").map((char, i) => (
    <motion.span
      key={i}
      custom={[i * 0.02, (word.length - i) * 0.01]}
      variants={translate}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  ));
}
