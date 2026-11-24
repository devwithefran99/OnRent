
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import { toast } from "sonner";
import { authClient, getAccessToken } from "@/lib/auth-client";
import Logo from "@/components/shared/Logo";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email: email.trim(),
      password,
      rememberMe,
    });

    if (signInError) {
      setLoading(false);
      toast.error(signInError.message ?? "Invalid email or password.");
      return;
    }

    toast.success("Signed in successfully! Welcome back.");

    const token = await getAccessToken({ force: true });
    if (!token) {
      toast.warning("Signed in, but the API token could not be created.");
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleSignIn = () => {
    toast.info("Google sign-in will be available soon.");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1600px] items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-2">

          {/* Left Side - Branding */}
          <section className="relative hidden min-h-[700px] overflow-hidden bg-slate-950 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_45%)]" />

            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative z-10">
              <Logo priority imageClassName="w-44" />

              <div className="mt-24">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Welcome Back
                </p>

                <h1 className="max-w-lg text-5xl font-bold leading-tight text-white xl:text-6xl">
                  Your Next Project Starts{" "}
                  <span className="text-blue-400">Here.</span>
                </h1>

                <p className="mt-7 max-w-md text-base leading-8 text-slate-300">
                  Access your OnRent account to manage rentals, explore
                  equipment, and keep your projects moving forward.
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <ShieldCheck size={26} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Your Rentals, One Place
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    A smarter way to manage your equipment rentals.
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} OnRent. All rights reserved.
              </p>
            </div>
          </section>

          {/* Right Side - Sign In Form */}
          <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-12 xl:px-16">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md"
            >
              {/* Mobile Logo */}
              <Logo className="mb-12 lg:hidden" imageClassName="w-36" />

              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <KeyRound size={28} />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Sign In
                </h2>

                <p className="mt-3 leading-7 text-slate-500">
                  Welcome back! Please enter your details to access
                  your account.
                </p>
              </div>

              {/* Google (UI only for now) */}
              <div className="mt-7">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <FaGoogle size={18} className="text-[#EA4335]" />
                  Continue with Google
                </button>

                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    or sign in with email
                  </span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSignIn} noValidate>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                    />
                    <span className="text-sm text-slate-600">
                      Remember me
                    </span>
                  </label>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <ShieldCheck size={15} />
                    Secure Sign In
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-orange-600 hover:shadow-orange-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing In…" : "Sign In"}
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-bold text-blue-600 transition hover:text-orange-600"
                  >
                    Create Account
                  </Link>
                </p>
              </div>

              {/* Bottom Note */}
              <div className="mt-10 flex items-center justify-center gap-2 border-t border-slate-100 pt-7">
                <CheckCircle2 size={16} className="text-green-600" />
                <p className="text-xs text-slate-400">
                  Your information is protected and secure.
                </p>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
