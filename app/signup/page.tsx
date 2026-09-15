"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
  const formData = new FormData(e.currentTarget);

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  console.log(name);
  console.log(email);
  console.log(password);
  console.log(confirmPassword);
  }

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
              Create an account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join PRO Sikhok and start learning today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E87942] focus:ring-2 focus:ring-[#E87942]/20"
              />
            </div>

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
                  placeholder="Create a password"
                  required
                  minLength={6}
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E87942] focus:ring-2 focus:ring-[#E87942]/20"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 accent-[#E87942]"
              />

              <label
                htmlFor="terms"
                className="text-sm text-gray-500"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-[#E87942] hover:underline"
                >
                  Terms & Conditions
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-[#D85F35] to-[#F5965A] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
            >
              Create Account
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#E87942] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}