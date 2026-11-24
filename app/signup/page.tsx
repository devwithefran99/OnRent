
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  KeyRound,
  Image as ImageIcon,
  Check,
  X,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import { toast } from "sonner";
import { authClient, getAccessToken } from "@/lib/auth-client";
import {
  getPasswordChecks,
  getPasswordError,
  isValidImageUrl,
} from "@/lib/validation";

type Role = "customer" | "owner";

type SignUpForm = {
  name: string;
  email: string;
  image: string;
  password: string;
  confirmPassword: string;
  role: Role;
};

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    image: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordChecks = getPasswordChecks(form.password);

  const updateField =
    (field: keyof SignUpForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!isValidImageUrl(form.image)) {
      toast.error("Please paste a valid photo link (starting with http).");
      return;
    }

    const passwordError = getPasswordError(form.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept the Terms & Conditions and Privacy Policy.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      image: form.image.trim(),
      password: form.password,
      role: form.role,
    });

    if (signUpError) {
      setLoading(false);
      toast.error(signUpError.message ?? "Could not create your account.");
      return;
    }

    toast.success("Account created successfully! Welcome to OnRent.");

    const token = await getAccessToken({ force: true });
    if (!token) {
      toast.warning("Account created, but the API token could not be created.");
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleSignUp = () => {
    toast.info("Google sign-up will be available soon.");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1600px] items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-2">

          {/* Left Side - Branding */}
          <section className="relative hidden min-h-[750px] overflow-hidden bg-slate-950 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_45%)]" />

            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                  O
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                  On<span className="text-blue-400">Rent</span>
                </span>
              </Link>

              <div className="mt-24">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Join the OnRent Community
                </p>

                <h1 className="max-w-lg text-5xl font-bold leading-tight text-white xl:text-6xl">
                  Start Your Journey with{" "}
                  <span className="text-blue-400">OnRent.</span>
                </h1>

                <p className="mt-7 max-w-md text-base leading-8 text-slate-300">
                  Create your account and discover a smarter way to rent
                  equipment or share your equipment with people who need it.
                </p>
              </div>
            </div>

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <UserRound size={23} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    For Customers
                  </h3>
                  <p className="text-sm text-slate-400">
                    Find and rent the equipment you need.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                  <BriefcaseBusiness size={23} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    For Equipment Owners
                  </h3>
                  <p className="text-sm text-slate-400">
                    List your equipment and reach more customers.
                  </p>
                </div>
              </div>

              <p className="pt-5 text-sm text-slate-500">
                © {new Date().getFullYear()} OnRent. All rights reserved.
              </p>
            </div>
          </section>

          {/* Right Side - Sign Up Form */}
          <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-12 xl:px-16">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md"
            >
              {/* Mobile Logo */}
              <Link
                href="/"
                className="mb-10 inline-flex items-center gap-2 lg:hidden"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                  O
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  On<span className="text-blue-600">Rent</span>
                </span>
              </Link>

              <div>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <KeyRound size={28} />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Create Account
                </h2>

                <p className="mt-3 leading-7 text-slate-500">
                  Join OnRent today. Fill in your details to get started.
                </p>
              </div>

              {/* Google (UI only for now) */}
              <div className="mt-7">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <FaGoogle size={18} className="text-[#EA4335]" />
                  Continue with Google
                </button>

                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    or sign up with email
                  </span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSignUp} noValidate>
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={updateField("name")}
                      autoComplete="name"
                      required
                      placeholder="Enter your full name"
                      className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

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
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={updateField("email")}
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Photo URL */}
                <div>
                  <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Photo URL
                  </label>

                  <div className="relative">
                    <ImageIcon
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="image"
                      name="image"
                      type="url"
                      value={form.image}
                      onChange={updateField("image")}
                      required
                      placeholder="https://example.com/your-photo.jpg"
                      className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    Paste a direct image link (imgbb or any public image URL).
                  </p>
                </div>

                {/* Account Type */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    Choose Account Type
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="customer"
                        checked={form.role === "customer"}
                        onChange={() =>
                          setForm((current) => ({ ...current, role: "customer" }))
                        }
                        className="peer sr-only"
                      />

                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:ring-2 peer-checked:ring-blue-500/10">
                        <UserRound
                          size={21}
                          className="text-blue-600"
                        />
                        <span className="text-sm font-semibold text-slate-700">
                          Customer
                        </span>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="owner"
                        checked={form.role === "owner"}
                        onChange={() =>
                          setForm((current) => ({ ...current, role: "owner" }))
                        }
                        className="peer sr-only"
                      />

                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:ring-2 peer-checked:ring-orange-500/10">
                        <BriefcaseBusiness
                          size={21}
                          className="text-orange-600"
                        />
                        <span className="text-sm font-semibold text-slate-700">
                          Owner
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={updateField("password")}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      placeholder="Create a password"
                      className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <ul className="mt-2 space-y-1 text-xs">
                    {[
                      {
                        ok: passwordChecks.minLength,
                        label: "At least 6 characters",
                      },
                      {
                        ok: passwordChecks.hasUppercase,
                        label: "One uppercase letter (A-Z)",
                      },
                      {
                        ok: passwordChecks.hasLowercase,
                        label: "One lowercase letter (a-z)",
                      },
                    ].map(({ ok, label }) => (
                      <li
                        key={label}
                        className={
                          ok
                            ? "flex items-center gap-1.5 text-emerald-600"
                            : "flex items-center gap-1.5 text-slate-400"
                        }
                      >
                        {ok ? <Check size={13} /> : <X size={13} />}
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={updateField("confirmPassword")}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      placeholder="Confirm your password"
                      className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600"
                  />

                  <span className="text-xs leading-6 text-slate-500">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-semibold text-blue-600 hover:text-orange-600"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold text-blue-600 hover:text-orange-600"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-orange-600 hover:shadow-orange-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating Account…" : "Create Account"}
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-7 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="font-bold text-blue-600 transition hover:text-orange-600"
                  >
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Security Note */}
              <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-6">
                <ShieldCheck size={16} className="text-green-600" />
                <p className="text-xs text-slate-400">
                  Your information is safe and secure with OnRent.
                </p>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
