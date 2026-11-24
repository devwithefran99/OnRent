import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  Home,
  PackageSearch,
  SearchX,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative overflow-hidden bg-slate-50">
      {/* Soft background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
      />

      <section className="relative mx-auto flex min-h-[72vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-600 shadow-sm">
          <SearchX size={14} />
          Error 404
        </span>

        <p className="mt-8 bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-500 bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          This page took a wrong turn.
        </h1>

        <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
          The page you are looking for may have been moved, deleted, or the
          link is incorrect. Let&apos;s get you back to renting.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-orange-600"
          >
            <Home size={16} />
            Back to home
          </Link>

          <Link
            href="/equipment"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
          >
            <PackageSearch size={16} />
            Browse equipment
          </Link>
        </div>

        <div className="mt-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Compass size={14} />
            Popular pages
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "How it works", href: "/how-it-works" },
              { label: "About us", href: "/about" },
              { label: "Sign in", href: "/signin" },
              { label: "Create account", href: "/signup" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-blue-600"
        >
          <ArrowLeft size={13} />
          Return to the homepage
        </Link>
      </section>
    </main>
  );
}
