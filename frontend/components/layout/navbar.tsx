"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Gauge,
  Heart,
  Menu,
  X,
  User,
  ArrowRight,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Search,
  ArrowLeftRight,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";
import { useLocalCars } from "@/hooks/use-local-cars";
import { useAuth } from "@/context/auth-context";
import { SearchModal } from "@/components/search/search-modal";

const links = [
  ["Home", "/"],
  ["Cars", "/cars"],
  ["Brands", "/brands"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const path = usePathname();
  const { language, t, toggleLanguage } = useLanguage();
  const { ids: cartIds } = useLocalCars("cart");
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const cartCount = cartIds.length;

  const languageButton = (
    <button
      type="button"
      onClick={toggleLanguage}
      className="flex h-9 items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white/80 px-2.5 py-1 text-xs font-semibold shadow-xs transition hover:border-neutral-300 hover:bg-neutral-50 active:scale-95"
      aria-label={language === "en" ? "ប្តូរទៅភាសាខ្មែរ" : "Switch to English"}
      title={language === "en" ? "ភាសាខ្មែរ" : "English"}
    >
      <Image
        src="/flags/english.svg"
        width={20}
        height={13}
        alt="English"
        className={`rounded-[3px] object-cover transition-opacity duration-200 ${
          language === "en" ? "opacity-100 ring-1 ring-black/10" : "opacity-35 grayscale"
        }`}
      />
      <span className="text-[10px] text-neutral-400">/</span>
      <Image
        src="/flags/khmer.svg"
        width={20}
        height={13}
        alt="Khmer"
        className={`rounded-[3px] object-cover transition-opacity duration-200 ${
          language === "km" ? "opacity-100 ring-1 ring-black/10" : "opacity-35 grayscale"
        }`}
      />
    </button>
  );

  // Do not render navbar on admin pages or admin login
  if (path?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl transition-all">
        <div className="container flex h-[76px] items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-black tracking-tight"
            aria-label="Aurelia Motors Homepage"
          >
            <span className="grid size-9.5 place-items-center rounded-xl bg-[#111214] text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#ef3f32]">
              <Gauge size={19} className="transition-transform group-hover:rotate-12" />
            </span>
            <span className="text-xl font-black tracking-tighter text-[#111214]">
              AURELIA<span className="text-[#ef3f32]">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 rounded-full border border-neutral-200/70 bg-neutral-100/60 p-1 backdrop-blur-md lg:flex">
            {links.map(([name, href]) => {
              const isActive = href === "/" ? path === "/" : path.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#111214] shadow-xs"
                      : "text-neutral-600 hover:text-[#111214]"
                  }`}
                >
                  {t(name)}
                </Link>
              );
            })}
          </nav>

          {/* Right CTA Actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search vehicles"
              className="flex h-9.5 items-center gap-2 rounded-full border border-neutral-200/80 bg-white/80 px-3 text-xs font-semibold text-neutral-500 shadow-xs transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
            >
              <Search size={15} className="text-neutral-400" />
              <span className="hidden xl:inline">{t("Search make or model")}</span>
              <span className="xl:hidden">Search</span>
              <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold text-neutral-400">
                ⌘K
              </kbd>
            </button>

            {languageButton}

            {/* Cart Badge Link */}
            <Link
              aria-label={t("Cart")}
              title={t("My Cart")}
              href="/cart"
              className="relative grid size-9.5 place-items-center rounded-full border border-neutral-200/80 bg-white/80 text-neutral-700 shadow-xs transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-[#ef3f32] active:scale-95"
            >
              <ShoppingCart
                size={17}
                className={cartCount > 0 ? "text-[#ef3f32]" : ""}
              />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid size-4.5 place-items-center rounded-full bg-[#ef3f32] text-[10px] font-extrabold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin Link if Admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  path.startsWith("/admin")
                    ? "bg-[#ef3f32] text-white shadow-xs"
                    : "border border-emerald-200 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <ShieldCheck size={13} />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {/* Authenticated User Menu vs Sign In */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={isAdmin ? "/admin" : "/cart"}
                  title={isAdmin ? "Admin Dashboard" : "My Cart"}
                  className="flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white px-3 py-1.5 text-xs font-bold transition hover:border-neutral-400"
                >
                  <div className="grid size-5.5 place-items-center rounded-full bg-neutral-900 text-[10px] font-black text-white">
                    {user.full_name?.charAt(0) || "U"}
                  </div>
                  <span className="max-w-[100px] truncate text-neutral-800">
                    {user.full_name?.split(" ")[0]}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  aria-label="Sign out"
                  className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-red-50 hover:text-red-500 transition shadow-xs"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn btn-dark py-2 px-5 text-xs tracking-wide"
              >
                <User size={14} className="opacity-80" />
                <span>{t("Sign in")}</span>
              </Link>
            )}
          </div>

          {/* Mobile Header Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 active:scale-95"
            >
              <Search size={16} />
            </button>

            {languageButton}

            <Link
              aria-label={t("Cart")}
              href="/cart"
              className="relative grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 active:scale-95"
            >
              <ShoppingCart
                size={16}
                className={cartCount > 0 ? "text-[#ef3f32]" : ""}
              />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#ef3f32] text-[9px] font-extrabold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setOpen(!open)}
              className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition active:scale-95"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-neutral-200/80 bg-white/95 backdrop-blur-xl md:hidden"
            >
              <div className="container flex flex-col space-y-1 py-5">
                {links.map(([name, href]) => {
                  const isActive = href === "/" ? path === "/" : path.startsWith(href);
                  return (
                    <Link
                      onClick={() => setOpen(false)}
                      key={href}
                      href={href}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition ${
                        isActive
                          ? "bg-neutral-100 text-[#ef3f32]"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <span>{t(name)}</span>
                      <ArrowRight size={15} className="opacity-40" />
                    </Link>
                  );
                })}

                <Link
                  onClick={() => setOpen(false)}
                  href="/cart"
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart size={16} className={cartCount > 0 ? "text-[#ef3f32]" : ""} />
                    {t("Cart")}
                  </span>
                  {cartCount > 0 && (
                    <span className="rounded-full bg-[#ef3f32] px-2 py-0.5 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {isAdmin && (
                  <Link
                    onClick={() => setOpen(false)}
                    href="/admin"
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-emerald-800 bg-emerald-50 transition"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      <span>Admin Dashboard</span>
                    </span>
                    <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                      Active
                    </span>
                  </Link>
                )}

                {isAuthenticated && user ? (
                  <div className="pt-3 space-y-2">
                    <Link
                      onClick={() => setOpen(false)}
                      href={isAdmin ? "/admin" : "/cart"}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-neutral-900 bg-neutral-100"
                    >
                      <span className="flex items-center gap-2">
                        {isAdmin ? <ShieldCheck size={16} className="text-emerald-600" /> : <ShoppingCart size={16} className="text-[#ef3f32]" />}
                        <span>{isAdmin ? "Admin Dashboard" : "My Cart"} ({user.full_name})</span>
                      </span>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase">
                        {user.role}
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="btn btn-light w-full py-3 text-xs font-bold text-red-600 border border-red-200"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-3">
                    <Link
                      onClick={() => setOpen(false)}
                      href="/login"
                      className="btn btn-dark w-full py-3"
                    >
                      <User size={15} />
                      <span>{t("Sign in")}</span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

