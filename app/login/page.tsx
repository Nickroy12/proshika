"use client";

import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Logged in user:", userCredential.user);

      // Redirect after successful login
      window.location.href = "/";
    } catch (error: any) {
      console.error("Firebase login error:", error);

      switch (error.code) {
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;

        case "auth/user-not-found":
          setError("No account found with this email.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;

        case "auth/too-many-requests":
          setError(
            "Too many failed attempts. Please try again later."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf7] px-5 py-10">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
        <div className="w-full rounded-2xl bg-white p-6 shadow-xl sm:p-8">

          {/* Logo */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-3xl font-bold"
            >
              <span className="bg-gradient-to-r from-[#D85F35] to-[#F5965A] bg-clip-text text-transparent">
                PRO
              </span>

              <span className="mx-1 text-black">✎</span>

              <span className="text-black">Sikhok</span>
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue learning.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E87942] focus:ring-2 focus:ring-[#E87942]/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-[#E87942] focus:ring-2 focus:ring-[#E87942]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-[#E87942]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#E87942] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-[#D85F35] to-[#F5965A] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#E87942] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
