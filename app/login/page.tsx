"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, PenToolIcon } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    console.log({
      email,
      password,
    });
  };

  return (
    <main className="min-h-screen bg-[#fffaf7] px-5 py-10">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
        <div className="w-full rounded-2xl bg-white p-6 shadow-lg sm:p-8">

          {/* Logo */}
          <Link
            href="/"
            className="mb-8 flex items-center justify-center text-3xl font-bold"
          >
            <span className="bg-gradient-to-r from-[#D85F35] to-[#F5965A] bg-clip-text text-transparent">
              PRO
            </span>

            <PenToolIcon
              size={25}
              strokeWidth={2.5}
              className="mx-1 text-black"
            />

            <span className="text-black">
              Sikhok
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#E87942] focus:ring-2 focus:ring-[#E87942]/20"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#D85F35] hover:text-[#E87942]"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#E87942] focus:ring-2 focus:ring-[#E87942]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E87942]"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 accent-[#D85F35]"
              />

              <label
                htmlFor="remember"
                className="text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-[#D85F35] to-[#F5965A] py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up */}
          <p className="mt-7 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#D85F35] hover:text-[#E87942]"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;