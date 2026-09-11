/**
 * Empty scroll runway, shared by the parallax components.
 *
 * Both effects animate across the window between "element enters the viewport"
 * and "element leaves it", so they need room on either side to travel through.
 * Without it the page loads already mid-effect and you never see it start.
 */
export default function Spacer({ label }: { label?: string }) {
  return (
    <div className="flex h-[850px] items-center justify-center">
      {label && (
        <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
          {label} ↓
        </span>
      )}
    </div>
  );
}
