import Link from "next/link";
import { ArrowLeft, ArrowRight, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-violet-50/60 px-4 py-12 font-sans">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />

      <div className="relative w-full max-w-xl text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20">
            P
          </span>
          Project Review Board
        </Link>

        <div className="relative mx-auto mt-12 flex h-52 w-64 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-violet-200/70" />
          <div className="absolute inset-5 rounded-full border border-dashed border-violet-300" />

          <span className="text-[112px] font-bold leading-none tracking-tighter text-violet-200">
            404
          </span>

          <div className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-white text-primary shadow-lg shadow-violet-200/50">
            <FileQuestion size={30} strokeWidth={1.7} />
          </div>

          <div className="absolute bottom-5 left-3 h-4 w-4 rounded-full bg-violet-300" />
          <div className="absolute right-8 bottom-9 h-3 w-3 rounded-full bg-purple-300" />
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Page not found
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Looks like you&apos;re lost.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Let&apos;s get you back to your workspace.
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>
        </div>

        <p className="mt-12 text-xs text-slate-400">
          Project Review Board · Submit. Review. Improve.
        </p>
      </div>
    </main>
  );
}
