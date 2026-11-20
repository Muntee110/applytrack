"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Check,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  // Forgot Password modal/view state
  const [isForgotMode, setIsForgotMode] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);
  const [resetMessage, setResetMessage] = React.useState("");
  const [resetError, setResetError] = React.useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage("Welcome back! Redirecting to your dashboard...");
        router.push("/applications");
        router.refresh();
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setResetError("");
    setResetMessage("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setResetError("Please enter your email address to receive reset instructions.");
      return;
    }

    try {
      setResetLoading(true);
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo,
      });

      if (error) {
        setResetError(error.message);
      } else {
        setResetMessage("Password reset email sent! Check your inbox for instructions.");
      }
    } catch (err) {
      setResetError(err.message || "Could not send reset email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-slate-50/60 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white transition-colors">
      {/* Ambient background glow accents matching Dashboard */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[28rem] w-[46rem] rounded-full bg-gradient-to-tr from-blue-600/10 via-indigo-500/10 to-transparent blur-3xl dark:from-blue-500/15 dark:via-indigo-500/10" />
      </div>

      {/* Top Header Bar with Brand and Theme Switcher */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between pb-6">
        <Link href="/login" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25 transition-transform group-hover:scale-105">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Apply<span className="text-blue-600 dark:text-blue-500">Track</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pipeline Pro
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Auth Form Container */}
      <main className="mx-auto w-full max-w-md my-auto py-4">
        <Card className="border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none rounded-2xl overflow-hidden transition-all">
          {!isForgotMode ? (
            /* Normal Sign In Form */
            <>
              <CardHeader className="space-y-2 pb-5 pt-7 text-center">
                <div className="flex justify-center">
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-semibold text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Member Access
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Sign in with your email and password to access your active job search pipeline.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 px-6 sm:px-8 pb-8">
                {/* Error Alert */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                    <div className="flex-1 font-medium">{errorMessage}</div>
                  </div>
                )}

                {/* Success Alert */}
                {successMessage && (
                  <div
                    role="status"
                    className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div className="flex-1 font-medium">{successMessage}</div>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email */}
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    required
                    autoComplete="email"
                    disabled={loading}
                  />

                  {/* Password + Forgot Link Header */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotMode(true);
                          setErrorMessage("");
                          setSuccessMessage("");
                        }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-4 hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={Lock}
                      required
                      autoComplete="current-password"
                      disabled={loading}
                      endAdornment={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors focus:outline-none"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      }
                    />
                  </div>

                  {/* Submit CTA */}
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    isLoading={loading}
                    disabled={loading}
                    className="w-full justify-center gap-2 shadow-sm shadow-blue-500/20 font-semibold mt-2"
                  >
                    <span>{loading ? "Signing in..." : "Sign In"}</span>
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                    <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 dark:text-slate-500">
                      New to ApplyTrack?
                    </span>
                  </div>
                </div>

                {/* Navigation link to Signup */}
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
                  >
                    Create account
                  </Link>
                </div>
              </CardContent>
            </>
          ) : (
            /* Forgot Password Sub-Flow */
            <>
              <CardHeader className="space-y-2 pb-5 pt-7 text-center">
                <div className="flex justify-center">
                  <Badge variant="warning" className="gap-1.5 px-3 py-1 font-semibold text-xs">
                    Password Recovery
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Enter your registered email address and we will send you a link to reset your password.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 px-6 sm:px-8 pb-8">
                {resetError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                    <div className="flex-1 font-medium">{resetError}</div>
                  </div>
                )}

                {resetMessage && (
                  <div
                    role="status"
                    className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div className="flex-1 font-medium">{resetMessage}</div>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <Input
                    label="Registered email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    required
                    autoComplete="email"
                    disabled={resetLoading}
                  />

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    isLoading={resetLoading}
                    disabled={resetLoading}
                    className="w-full justify-center gap-2 font-semibold shadow-sm shadow-blue-500/20"
                  >
                    <span>{resetLoading ? "Sending Link..." : "Send Reset Link"}</span>
                    {!resetLoading && <ArrowRight className="h-4 w-4" />}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setIsForgotMode(false);
                      setResetError("");
                      setResetMessage("");
                    }}
                    className="w-full justify-center gap-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Sign In</span>
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        {/* Features Checklist / Trust Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Real-time Pipeline Sync</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Smart Stage Filtering</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Salary & Stage Records</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-5xl pt-6 text-center text-xs text-slate-400 dark:text-slate-600">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <span>Secured with Supabase Authentication.</span>
        </p>
      </footer>
    </div>
  );
}
