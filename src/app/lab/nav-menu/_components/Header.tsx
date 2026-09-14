"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { background, opacity } from "./anim";
import Nav from "./Nav";

/**
 * Adapted from olivierlarose/nav-menu (2023). SCSS modules became Tailwind
 * classes, and framer-motion became motion — the same library, renamed.
 *
 * The whole thing runs off one boolean. The burger morph, the Menu/Close
 * swap, the backdrop and the panel are all just variants keyed off it.
 */
export default function Header() {
  const [isActive, setIsActive] = useState(false);

  return (
    // z-[60] covers the lab layout's fixed "← index" link (z-50); the bar's
    // own left link does the same job.
    <header className="fixed z-[60] w-full bg-[#f4f0ea] p-2.5 sm:p-5">
      <div className="relative flex justify-center text-xs uppercase sm:text-[15px]">
        <Link href="/" className="absolute left-0 text-black">
          Key&apos;s Sandbox
        </Link>

        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          aria-expanded={isActive}
          aria-controls="nav-menu"
          className="flex cursor-pointer items-center gap-2 uppercase"
        >
          <Burger isActive={isActive} />
          <span className="relative flex items-center">
            <motion.span
              variants={opacity}
              animate={isActive ? "closed" : "open"}
              aria-hidden={isActive}
            >
              Menu
            </motion.span>
            <motion.span
              variants={opacity}
              animate={isActive ? "open" : "closed"}
              aria-hidden={!isActive}
              className="absolute"
            >
              Close
            </motion.span>
          </span>
        </button>

        <motion.div
          variants={opacity}
          animate={isActive ? "closed" : "open"}
          className="absolute right-0 flex gap-[30px]"
        >
          <p className="hidden sm:block">Shop</p>
          <div className="flex items-center gap-2">
            <svg width="19" height="20" viewBox="0 0 19 20" fill="none" aria-hidden>
              <path
                d="M1.66602 1.66667H2.75449C2.9595 1.66667 3.06201 1.66667 3.1445 1.70437C3.2172 1.73759 3.2788 1.79102 3.32197 1.85829C3.37096 1.93462 3.38546 2.0361 3.41445 2.23905L3.80887 5M3.80887 5L4.68545 11.4428C4.79669 12.2604 4.85231 12.6692 5.04777 12.977C5.22 13.2481 5.46692 13.4637 5.75881 13.5978C6.09007 13.75 6.50264 13.75 7.32777 13.75H14.4593C15.2448 13.75 15.6375 13.75 15.9585 13.6087C16.2415 13.4841 16.4842 13.2832 16.6596 13.0285C16.8585 12.7397 16.9319 12.3539 17.0789 11.5823L18.1819 5.79141C18.2337 5.51984 18.2595 5.38405 18.222 5.27792C18.1892 5.18481 18.1243 5.1064 18.039 5.05668C17.9417 5 17.8035 5 17.527 5H3.80887ZM8.33268 17.5C8.33268 17.9602 7.95959 18.3333 7.49935 18.3333C7.03911 18.3333 6.66602 17.9602 6.66602 17.5C6.66602 17.0398 7.03911 16.6667 7.49935 16.6667C7.95959 16.6667 8.33268 17.0398 8.33268 17.5ZM14.9993 17.5C14.9993 17.9602 14.6263 18.3333 14.166 18.3333C13.7058 18.3333 13.3327 17.9602 13.3327 17.5C13.3327 17.0398 13.7058 16.6667 14.166 16.6667C14.6263 16.6667 14.9993 17.0398 14.9993 17.5Z"
                stroke="#4D3D30"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>Cart(0)</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={background}
        initial="initial"
        animate={isActive ? "open" : "closed"}
        className="absolute left-0 top-full w-full bg-black opacity-50"
      />

      <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
    </header>
  );
}

/**
 * Two 1px bars 8px apart that slide to the middle and rotate into an X. Real
 * spans rather than the original's ::before/::after — same look, and the
 * state lives in plain class names instead of a nested selector.
 */
function Burger({ isActive }: { isActive: boolean }) {
  const bar =
    "relative block h-px w-full bg-black transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]";

  return (
    <span aria-hidden className="pointer-events-none relative w-[22.5px]">
      <span className={`${bar} ${isActive ? "top-px -rotate-45" : "top-1"}`} />
      <span className={`${bar} ${isActive ? "-top-px rotate-45" : "-top-1"}`} />
    </span>
  );
}
