import Link from "next/link";
import { experiments } from "@/lib/experiments";

export default function Home() {
  return (
    <main className="min-h-dvh w-full bg-white px-6 py-20 sm:px-10">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-16">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 ">hi there, welcome to the
            <span className="text-3xl font-bold text-indigo-600 mx-2">Key's</span>
            Sandbox.
          </h1>
          <p className="mt-2 text-zinc-500">
            A lab. Things get built here to find out how they work.
          </p>
        </header>

        <ul className="space-y-1">
          {experiments.map((experiment) => (
            <li key={experiment.slug}>
              {experiment.status === "idea" ? (
                <ExperimentRow experiment={experiment} />
              ) : (
                <Link
                  href={`/lab/${experiment.slug}`}
                  className="block rounded-lg transition-colors hover:bg-zinc-50"
                >
                  <ExperimentRow experiment={experiment} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function ExperimentRow({
  experiment,
}: {
  experiment: (typeof experiments)[number];
}) {
  const isIdea = experiment.status === "idea";

  return (
    <article className={`px-4 py-5 ${isIdea ? "opacity-40" : ""}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-medium text-zinc-900">{experiment.title}</h2>
        <span className="shrink-0 font-mono text-xs text-zinc-400">
          {experiment.status}
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
        {experiment.blurb}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {experiment.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
