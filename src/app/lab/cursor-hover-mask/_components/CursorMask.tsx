"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";

/**
 * Adapted from olivierlarose/cursor-hover-mask.
 *
 * Two copies of the screen stacked on top of each other. The top one is a
 * solid accent color with different text, and a CSS mask cuts it down to a
 * small circle that follows the cursor — so you only ever see it through that
 * hole. Hovering the text grows the hole from 40px to 400px.
 *
 * The original masked with an SVG file; a radial-gradient draws the same
 * circle in CSS with nothing to load.
 */

/**
 * One per visit. `visible` is [before, accent word, after]; `hidden` is what
 * shows through the mask. `ink` is the hidden text's color, drawn on `accent`.
 */
const VARIANTS = [
  { visible: ["I'm a ", "curious", " developer rebuilding the web effects I like, one experiment at a time."],
    hidden: "A junior dev who breaks things on purpose, just to see how they were put together.",
    background: "#0f0f0f", text: "#afa18f", accent: "#ec4e39", ink: "#000000" },
  { visible: ["Every bug is a ", "lesson", " I didn't know I signed up for."],
    hidden: "Every bug is a lesson I'd happily have skipped. And yet, here we are.",
    background: "#0b1d2a", text: "#9fb3c8", accent: "#f2c14e", ink: "#0b1d2a" },
  { visible: ["Good code is ", "boring", ". Good motion is anything but."],
    hidden: "Keep the code boring so the animations get to have all the fun.",
    background: "#f4efe6", text: "#8a7f70", accent: "#1f3d2b", ink: "#f4efe6" },
  { visible: ["I read the docs ", "after", " it breaks, like everyone else."],
    hidden: "Okay, sometimes before. Mostly after. Honestly? Always after.",
    background: "#1a1030", text: "#b7a8d6", accent: "#7cf5c4", ink: "#1a1030" },
  { visible: ["Ship it ", "ugly", ", then make it beautiful."],
    hidden: "Nobody sees the first draft. Everybody sees the one you finished.",
    background: "#fff5f7", text: "#b08a93", accent: "#d6336c", ink: "#ffffff" },
  { visible: ["Small experiments, ", "big", " curiosity."],
    hidden: "Twelve tiny demos teach more than one giant plan that never ships.",
    background: "#101a14", text: "#8fa89a", accent: "#e8e3d3", ink: "#101a14" },
  { visible: ["Commit ", "early", ", commit often, push when brave."],
    hidden: "My git history is a diary I'm far too embarrassed to read.",
    background: "#fdf6e3", text: "#7a6f5a", accent: "#268bd2", ink: "#fdf6e3" },
  { visible: ["console.log is my ", "favorite", " debugger."],
    hidden: "Breakpoints are great. I just keep forgetting they exist.",
    background: "#002b36", text: "#839496", accent: "#b58900", ink: "#002b36" },
  { visible: ["It works on ", "my", " machine, which is a start."],
    hidden: "Deploying is just finding out whose machine it doesn't work on.",
    background: "#2b0f0e", text: "#c9a19c", accent: "#ff8a5b", ink: "#2b0f0e" },
  { visible: ["Naming things is the ", "hardest", " part. Still."],
    hidden: "An hour on this variable name and it's still called data2.",
    background: "#eef4ff", text: "#6b7a99", accent: "#3b5bdb", ink: "#eef4ff" },
  { visible: ["Every expert was once a ", "beginner", " with a stubborn streak."],
    hidden: "The only trick is not quitting in the confusing middle bit.",
    background: "#1b1b1b", text: "#a3a3a3", accent: "#a3e635", ink: "#1b1b1b" },
  { visible: ["CSS is ", "easy", ", said nobody centering a div."],
    hidden: "Flexbox fixed it. Then grid fixed flexbox. Then I fixed my attitude.",
    background: "#fef3c7", text: "#92741f", accent: "#7c2d12", ink: "#fef3c7" },
  { visible: ["Read the ", "error", " message. The whole thing."],
    hidden: "Line one is panic. Line four usually tells you exactly what's wrong.",
    background: "#0f172a", text: "#94a3b8", accent: "#f87171", ink: "#0f172a" },
  { visible: ["Motion should ", "explain", ", not decorate."],
    hidden: "If an animation needs explaining, it's doing the wrong job.",
    background: "#f0fdf4", text: "#5f7d6b", accent: "#15803d", ink: "#f0fdf4" },
  { visible: ["Delete ", "more", " code than you write."],
    hidden: "The best line I wrote this week was the one I removed.",
    background: "#18122b", text: "#a99bd4", accent: "#f472b6", ink: "#18122b" },
  { visible: ["Tutorials get you ", "started", ". Breaking them gets you good."],
    hidden: "Copy it, run it, change one number, watch what explodes.",
    background: "#e0f2fe", text: "#4f7a94", accent: "#0c4a6e", ink: "#e0f2fe" },
  { visible: ["Refactor ", "later", " is a promise, not a plan."],
    hidden: "Later is a lovely place. Nothing I've put there ever came back.",
    background: "#292524", text: "#b6aca4", accent: "#fb923c", ink: "#292524" },
  { visible: ["The browser is the ", "best", " playground ever made."],
    hidden: "Open devtools on a site you love and start taking it apart.",
    background: "#fafafa", text: "#737373", accent: "#111111", ink: "#fafafa" },
  { visible: ["Stay ", "curious", ", stay slightly confused."],
    hidden: "Confused means you're at the edge of what you know. Good spot.",
    background: "#3b0764", text: "#d8b4fe", accent: "#fde047", ink: "#3b0764" },
  { visible: ["Tests are notes to ", "future", " you."],
    hidden: "Future me is tired and forgetful. Past me should be kinder.",
    background: "#ecfeff", text: "#4b8791", accent: "#be185d", ink: "#ecfeff" },
  { visible: ["Fast is ", "nice", ". Clear is better."],
    hidden: "Nobody remembers the clever one-liner. Everybody remembers its bug.",
    background: "#052e16", text: "#86b39a", accent: "#fda4af", ink: "#052e16" },
  { visible: ["Build the ", "small", " version first."],
    hidden: "The small version ships. The perfect version is still a sketch.",
    background: "#fff7ed", text: "#9a7b5f", accent: "#c2410c", ink: "#fff7ed" },
  { visible: ["git ", "blame", " is a mirror."],
    hidden: "I went looking for who wrote this mess. It was me, last Tuesday.",
    background: "#111827", text: "#9ca3af", accent: "#60a5fa", ink: "#111827" },
  { visible: ["Ask the ", "dumb", " question. Everyone's wondering."],
    hidden: "Half the room was stuck on the same thing and just didn't say it.",
    background: "#fdf2f8", text: "#9d6b85", accent: "#6d28d9", ink: "#fdf2f8" },
];

const BAG_KEY = "cursor-hover-mask:bag";

/**
 * Shuffle-bag rotation: every variant shows once, in random order, before any
 * repeats. What's left of the current shuffle lives in localStorage; when it
 * runs out a new one starts, never opening with the variant just seen.
 *
 * Only reads — the draw is saved once it's actually on screen.
 */
function draw(): { index: number; rest: number[] } {
  let bag: number[] = [];
  let last = -1;
  try {
    const saved = JSON.parse(localStorage.getItem(BAG_KEY) ?? "{}");
    const valid =
      Array.isArray(saved.bag) &&
      saved.bag.every((i: unknown) => Number.isInteger(i) && (i as number) >= 0 && (i as number) < VARIANTS.length);
    if (valid) bag = saved.bag;
    if (Number.isInteger(saved.last)) last = saved.last;
  } catch {}

  if (bag.length === 0) {
    bag = VARIANTS.map((_, i) => i);
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    if (bag[0] === last) bag.push(bag.shift()!);
  }

  const [index, ...rest] = bag;
  return { index, rest };
}

const noopSubscribe = () => () => {};

export default function CursorMask() {
  // A fresh draw per mount, so every visit or refresh gets a new one. The
  // server draws too, so nothing variant-specific renders until `mounted` —
  // otherwise the two draws would disagree during hydration.
  const [{ index, rest }] = useState(draw);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Off-screen until the pointer first moves (the original started at null,
  // which made the mask position "NaNpx").
  const [pos, setPos] = useState({ x: -400, y: -400 });
  const [hovered, setHovered] = useState(false);
  const size = hovered ? 400 : 40;

  useEffect(() => {
    try {
      localStorage.setItem(BAG_KEY, JSON.stringify({ bag: rest, last: index }));
    } catch {}
  }, [index, rest]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!mounted) return <main className="h-dvh" />;

  const v = VARIANTS[index];
  const text = "w-[1000px] max-w-full p-10";

  return (
    <main
      className="relative h-dvh cursor-default overflow-hidden text-[min(64px,8vw)] leading-[1.05]"
      style={{ backgroundColor: v.background }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{
          backgroundColor: v.accent,
          color: v.ink,
          maskImage: "radial-gradient(circle closest-side, #000 98%, transparent)",
          maskRepeat: "no-repeat",
        }}
        initial={false}
        animate={{
          maskPosition: `${pos.x - size / 2}px ${pos.y - size / 2}px`,
          maskSize: `${size}px ${size}px`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      >
        <p
          className={text}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          {v.hidden}
        </p>
      </motion.div>

      <div
        className="flex h-full items-center justify-center"
        style={{ color: v.text }}
      >
        <p className={text}>
          {v.visible[0]}
          <span style={{ color: v.accent }}>{v.visible[1]}</span>
          {v.visible[2]}
        </p>
      </div>
    </main>
  );
}
