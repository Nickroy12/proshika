"use client";

import { Menu, X, PenToolIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NavLink {
  name: string;
  link: string;
}

const navLinks: NavLink[] = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Services",
    link: "/services",
  },
  {
    name: "Contact",
    link: "/contact",
  },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // ================= SCROLL DETECTION =================
  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ================= BODY SCROLL LOCK =================
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // ================= LOGO =================
  const Logo = () => (
    <Link
      href="/"
      onClick={() => setIsMenuOpen(false)}
      className="flex items-center text-3xl font-bold transition-all duration-300 sm:text-4xl"
    >
      <span className="bg-gradient-to-r from-[#D85F35] to-[#F5965A] bg-clip-text text-transparent">
        PRO
      </span>

      <PenToolIcon
        size={27}
        strokeWidth={2.5}
        className="mx-1 text-black"
      />

      <span className="text-black">Sikhok</span>
    </Link>
  );

  // ================= NAV LINKS =================
  const NavigationLinks = () => (
    <>
      {navLinks.map((item: NavLink) => (
        <Link
          key={item.name}
          href={item.link}
          onClick={() => setIsMenuOpen(false)}
          className="font-semibold text-black transition-colors duration-300 hover:text-[#E87942]"
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  // ================= AUTH BUTTONS =================
  const AuthButtons = () => (
    <div className="ml-2 flex items-center gap-3">
      <Link
        href="/login"
        onClick={() => setIsMenuOpen(false)}
        className="rounded-lg px-4 py-2 font-medium text-black transition-colors duration-300 hover:text-[#E87942]"
      >
        Sign In
      </Link>

      <Link
        href="/signup"
        onClick={() => setIsMenuOpen(false)}
        className="rounded-lg bg-gradient-to-r from-[#D85F35] to-[#F5965A] px-5 py-2.5 font-medium text-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
      >
        Sign Up
      </Link>
    </div>
  );

  return (
    <>
      {/* =====================================================
          NORMAL NAVBAR
          Visible at the top of the page
      ===================================================== */}
      <header className="relative z-30 w-full bg-transparent">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <NavigationLinks />

            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
            className="text-black transition-colors duration-300 hover:text-[#E87942] md:hidden"
          >
            <Menu size={28} />
          </button>
        </nav>
      </header>


      <header
        className={`
          fixed
          left-0
          top-0
          z-40
          w-full
          bg-white/95
          shadow-md
          backdrop-blur-md
          transition-transform
          duration-500
          ease-in-out
          ${
            isScrolled
              ? "translate-y-0"
              : "-translate-y-full"
          }
        `}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <NavigationLinks />

            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
            className="text-black transition-colors duration-300 hover:text-[#E87942] md:hidden"
          >
            <Menu size={28} />
          </button>
        </nav>
      </header>

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}
      <div
        className={`
          fixed
          inset-0
          z-50
          md:hidden
          ${
            isMenuOpen
              ? "visible"
              : "invisible"
          }
        `}
      >
        {/* Overlay */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`
            absolute
            inset-0
            bg-black/40
            transition-opacity
            duration-300
            ${
              isMenuOpen
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        />

        {/* Sidebar */}
        <aside
          className={`
            absolute
            right-0
            top-0
            h-full
            w-[280px]
            bg-white
            shadow-2xl
            transition-transform
            duration-700
            ease-in-out
            ${
              isMenuOpen
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >
          {/* Sidebar Header */}
          <div className="flex h-20 items-center justify-between border-b border-gray-100 px-5">
            
            {/* Mobile Logo */}
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center text-2xl font-bold"
            >
              <span className="bg-gradient-to-r from-[#D85F35] to-[#F5965A] bg-clip-text text-transparent">
                PRO
              </span>

              <PenToolIcon
                size={22}
                strokeWidth={2.5}
                className="mx-1 text-black"
              />

              <span className="text-black">
                Sikhok
              </span>
            </Link>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close navigation menu"
              className="text-black transition-colors duration-300 hover:text-[#E87942]"
            >
              <X size={28} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col px-6 py-6">
            
            {/* Links */}
            {navLinks.map((item: NavLink) => (
              <Link
                key={item.name}
                href={item.link}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-gray-200 py-4 font-medium text-black transition-all duration-300 hover:pl-2 hover:text-[#E87942]"
              >
                {item.name}
              </Link>
            ))}

            {/* Auth */}
            <div className="mt-8 flex flex-col gap-3">
              
              {/* Sign In */}
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full rounded-lg border border-gray-300 py-3 text-center font-medium text-black transition-all duration-300 hover:border-[#E87942] hover:text-[#E87942]"
              >
                Sign In
              </Link>

              {/* Sign Up */}
              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="w-full rounded-lg bg-gradient-to-r from-[#D85F35] to-[#F5965A] py-3 text-center font-medium text-white shadow-sm transition-all duration-300 hover:shadow-md"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;