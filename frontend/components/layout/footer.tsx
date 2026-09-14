"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Camera, Gauge, MessageCircle, ThumbsUp, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const groups = [
  {
    title: "Explore",
    links: [
      { name: "Cars", href: "/cars" },
      { name: "Brands", href: "/brands" },
      { name: "Compare", href: "/compare" },
      { name: "My Cart", href: "/cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Showroom", href: "/cars" },
    ],
  },
];

export function Footer() {
  const { t } = useLanguage();
  const path = usePathname();

  // Do not render footer on admin pages or admin login
  if (path?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-neutral-800 bg-[#0d0e11] text-white">
      <div className="container py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5 font-black tracking-tight">
              <span className="grid size-9 place-items-center rounded-xl bg-[#ef3f32] text-white shadow-xs">
                <Gauge size={19} />
              </span>
              <span className="text-xl font-black tracking-tighter text-white">
                AURELIA<span className="text-[#ef3f32]">.</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
              {t(
                "Exceptional cars, transparently sourced. We make discovering your next drive feel as rewarding as owning it."
              )}
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              {[
                { Icon: Camera, label: "Instagram" },
                { Icon: ThumbsUp, label: "Facebook" },
                { Icon: MessageCircle, label: "Telegram" },
              ].map(({ Icon, label }, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label={label}
                  className="grid size-9.5 place-items-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition hover:border-[#ef3f32] hover:bg-[#ef3f32] hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Groups */}
          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-neutral-400">
                {t(group.title)}
              </p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm font-medium text-neutral-300 transition hover:text-white"
                    >
                      <span>{t(link.name)}</span>
                      <ArrowUpRight
                        size={13}
                        className="ml-1 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Showroom & Visit Details */}
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-neutral-400">
              {t("Visit")}
            </p>
            <div className="space-y-3.5 text-sm text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#ef3f32]" />
                <div>
                  <p className="font-semibold text-white">Norodom Boulevard</p>
                  <p className="text-xs text-neutral-400">Phnom Penh, Cambodia</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock size={16} className="mt-0.5 shrink-0 text-neutral-400" />
                <div className="text-xs text-neutral-400">
                  <p>Mon–Sat 9:00 AM – 7:00 PM</p>
                  <p>Sun 10:00 AM – 5:00 PM</p>
                </div>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Showroom Open Today
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-neutral-400 sm:flex-row">
          <p>© 2026 Aurelia Motors. Crafted for the road ahead.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/about" className="transition hover:text-white">
              {t("About")}
            </Link>
            <Link href="/compare" className="transition hover:text-white">
              {t("Compare")}
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              {t("Contact")}
            </Link>
            <Link href="/cars" className="transition hover:text-white">
              {t("Curated inventory")}
            </Link>
            <Link href="/cart" className="transition hover:text-white">
              {t("My Cart")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
