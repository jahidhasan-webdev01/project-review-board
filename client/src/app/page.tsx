"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoAccounts = {
    student: {
      email: "student1@projectreviewboard.com",
      password: "Student@1",
    },
    mentor: {
      email: "mentor1@projectreviewboard.com",
      password: "Mentor@1",
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login failed");
        return;
      }

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      window.location.href =
        result.data.user.role === "STUDENT" ? "/student" : "/mentor";
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = (role) => {
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
    setError("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-violet-50/60 px-4 py-10 font-sans">
      <div className="w-full max-w-lg rounded-2xl border border-violet-100 bg-white p-8 shadow-xl shadow-violet-100/60 sm:p-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            P
          </span>
          Project Review Board
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium text-primary">
            Welcome to your workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to submit projects and review submissions.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-slate-400 transition hover:text-primary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-violet-100 bg-violet-50/50 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-800">
            Demo Accounts
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => useDemoAccount("student")}
              className="rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-primary hover:bg-violet-50"
            >
              <p className="text-sm font-semibold text-primary">Student</p>
              <p className="mt-1 break-all text-xs text-slate-500">
                {demoAccounts.student.email}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {demoAccounts.student.password}
              </p>
              <p className="mt-3 text-xs font-semibold text-primary">
                Use account →
              </p>
            </button>

            <button
              type="button"
              onClick={() => useDemoAccount("mentor")}
              className="rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-primary hover:bg-violet-50"
            >
              <p className="text-sm font-semibold text-primary">Mentor</p>
              <p className="mt-1 break-all text-xs text-slate-500">
                {demoAccounts.mentor.email}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {demoAccounts.mentor.password}
              </p>
              <p className="mt-3 text-xs font-semibold text-primary">
                Use account →
              </p>
            </button>
          </div>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-xs text-slate-400">NEW TO THE PLATFORM?</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary transition hover:underline"
          >
            Create account
          </Link>
        </p>

        <p className="mt-8 text-center text-xs text-slate-400">
          Submit. Review. Improve.
        </p>
      </div>
    </main>
  );
}
