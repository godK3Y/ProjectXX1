import type { Variants } from "motion/react";

const ease = [0.76, 0, 0.24, 1] as const;
const transition = { duration: 1, ease };

export const opacity: Variants = {
  initial: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.35 } },
  closed: { opacity: 0, transition: { duration: 0.35 } },
};

export const height: Variants = {
  initial: { height: 0 },
  enter: { height: "auto", transition },
  exit: { height: 0, transition },
};

export const background: Variants = {
  initial: { height: 0 },
  open: { height: "100vh", transition },
  closed: { height: 0, transition },
};

export const blur: Variants = {
  initial: { filter: "blur(0px)", opacity: 1 },
  open: { filter: "blur(4px)", opacity: 0.6, transition: { duration: 0.3 } },
  closed: { filter: "blur(0px)", opacity: 1, transition: { duration: 0.3 } },
};

/** `custom` is `[enterDelay, exitDelay]`, in seconds. */
export const translate: Variants = {
  initial: { y: "100%", opacity: 0 },
  enter: ([delay]: [number, number]) => ({
    y: 0,
    opacity: 1,
    transition: { ...transition, delay },
  }),
  exit: ([, delay]: [number, number]) => ({
    y: "100%",
    opacity: 0,
    transition: { duration: 0.7, ease, delay },
  }),
};
