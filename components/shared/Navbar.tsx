"use client";

import { Menu, X, PenToolIcon, User, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface NavLink {
  name: string;
  link: string;
}

const navLinks: NavLink[] = [
  {
    name: "Expenses",
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
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // ================= CLOSE DROPDOWN ON OUTSIDE CLICK =================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  // ================= SIGN OUT HANDLER =================

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserDropdownOpen(false);
      setIsMenuOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // ================= LOGO =================

  const Logo = () => (
    <Link
      href="/"
      onClick={() => setIsMenuOpen(false)}
      className="flex items-center text-3xl font-bold transition-all duration-300 sm:text-4xl"
    >
      <span className="bg-gradient-to-r from-[#D85F35] to-[#F5965A] bg-clip-text text-transparent">
        Expense
      </span>

      <PenToolIcon
        size={27}
        strokeWidth={2.5}
        className="mx-1 text-black"
      />

      <span className="text-black">Tracker</span>
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

  // ================= AUTH / USER PROFILE BUTTONS =================

  const AuthButtons = () => {
    if (isPending) {
      return (
        <div className="ml-2 flex items-center gap-2">
          <div className="h-9 w-24 animate-pulse rounded-lg bg-muted/60" />
        </div>
      );
    }

    if (session?.user) {
      const user = session.user;
      const initials = (user.name || user.email || "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return (
        <div className="relative ml-2" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2.5 rounded-full border border-orange-200 bg-orange-50/70 py-1.5 pl-2 pr-3.5 shadow-sm transition-all hover:border-[#D85F35] hover:bg-orange-100/70"
          >
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-8 w-8 rounded-full object-cover border border-orange-300"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#D85F35] to-[#F5965A] text-xs font-bold text-white shadow-inner">
                {initials}
              </div>
            )}
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-foreground leading-tight">
                {user.name || "User"}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight max-w-[110px] truncate">
                {user.email}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {/* User Dropdown Menu */}
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="border-b border-border/60 bg-muted/40 p-3.5">
                <p className="text-xs font-bold text-foreground">{user.name || "Logged In User"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="ml-2 flex items-center gap-3">
        <Link
          href="/login"
          onClick={() => setIsMenuOpen(false)}
          className="rounded-lg px-4 py-2 font-semibold text-black transition-colors duration-300 hover:text-[#E87942]"
        >
          Sign In
        </Link>

        <Link
          href="/signup"
          onClick={() => setIsMenuOpen(false)}
          className="rounded-lg bg-gradient-to-r from-[#D85F35] to-[#F5965A] px-5 py-2.5 font-semibold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
        >
          Sign Up
        </Link>
      </div>
    );
  };

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

      {/* =====================================================
          SCROLL NAVBAR
          Appears smoothly from top after scrolling
      ===================================================== */}

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
            w-[300px]
            bg-white
            shadow-2xl
            transition-transform
            duration-700
            ease-in-out
            flex flex-col justify-between
            ${
              isMenuOpen
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >
          <div>
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

            {/* Logged in User Card in Sidebar (if logged in) */}
            {session?.user && (
              <div className="m-4 flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50/60 p-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#D85F35] to-[#F5965A] font-bold text-white shadow-sm shrink-0">
                  {(session.user.name || session.user.email || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-black truncate">
                    {session.user.name || "User"}
                  </span>
                  <span className="text-[11px] text-gray-500 truncate">
                    {session.user.email}
                  </span>
                </div>
              </div>
            )}

            {/* Sidebar Links */}
            <div className="flex flex-col px-6 py-2">
              {navLinks.map((item: NavLink) => (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={() => setIsMenuOpen(false)}
                  className="border-b border-gray-100 py-3.5 font-semibold text-black transition-all duration-300 hover:pl-2 hover:text-[#E87942]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar Footer Auth */}
          <div className="p-6 border-t border-gray-100">
            {session?.user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-center font-semibold text-red-600 transition-all hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 text-center font-semibold text-black transition-all duration-300 hover:border-[#E87942] hover:text-[#E87942]"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full rounded-lg bg-gradient-to-r from-[#D85F35] to-[#F5965A] py-2.5 text-center font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
