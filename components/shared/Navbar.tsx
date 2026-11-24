"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { authClient, clearAuthToken } from "@/lib/auth-client";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Equipment", href: "/equipment" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About Us", href: "/about" },
  ];

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    clearAuthToken();
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Image/onrent-logo.png"
            alt="OnRent Logo"
            width={80}
            height={80}
            priority
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-[#3B82F6]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <span className="h-9 w-40 animate-pulse rounded-lg bg-slate-100" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#3B82F6] hover:text-[#3B82F6]"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="inline-flex items-center gap-2 rounded-lg border border-[#3B82F6] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-[#3B82F6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={16} />
                {signingOut ? "Signing out…" : "Sign Out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-lg border border-[#3B82F6] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-[#3B82F6]"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-slate-700 hover:text-[#3B82F6]"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex gap-3 border-t border-slate-100 pt-4">
              {isPending ? (
                <span className="h-10 flex-1 animate-pulse rounded-lg bg-slate-100" />
              ) : session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-lg bg-[#3B82F6] py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex-1 rounded-lg border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 disabled:opacity-60"
                  >
                    {signingOut ? "Signing out…" : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-lg border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-lg bg-[#3B82F6] py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
