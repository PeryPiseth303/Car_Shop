"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, X, Sparkles, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocalCars } from "@/hooks/use-local-cars";
import { cars } from "@/lib/data";
import { useLanguage } from "@/hooks/use-language";

export function CompareBar() {
  const pathname = usePathname();
  const { ids, toggle } = useLocalCars("compare");
  const { t } = useLanguage();

  // Do not show on the /compare page itself
  if (pathname === "/compare" || ids.length === 0) {
    return null;
  }

  const selectedCars = ids
    .map((id) => cars.find((c) => c.id === id))
    .filter(Boolean);

  const clearAll = () => {
    ids.forEach((id) => toggle(id));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 w-[94%] max-w-2xl"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 rounded-2xl border border-neutral-800 bg-[#111214]/95 p-3.5 sm:px-5 sm:py-3 shadow-2xl backdrop-blur-xl text-white ring-1 ring-white/10">
          {/* Left: Info & Thumbnails */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="grid size-9.5 shrink-0 place-items-center rounded-xl bg-[#ef3f32] text-white shadow-md">
              <ArrowLeftRight size={18} />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-[240px] sm:max-w-none">
              {selectedCars.map((car) => {
                if (!car) return null;
                return (
                  <div
                    key={car.id}
                    className="group relative size-11 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-neutral-800"
                    title={`${car.brand} ${car.model}`}
                  >
                    <Image
                      src={car.images[0]}
                      alt={car.model}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggle(car.id);
                      }}
                      className="absolute inset-0 grid place-items-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100 text-white"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}

              {/* Empty placeholder slots */}
              {Array.from({ length: Math.max(0, 4 - selectedCars.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="size-11 shrink-0 rounded-xl border border-dashed border-white/20 grid place-items-center text-[10px] font-bold text-neutral-500"
                >
                  +{i + 1 + selectedCars.length}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-neutral-400 transition hover:text-white px-2 py-1"
            >
              {t("Reset all")}
            </button>

            <Link
              href="/compare"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black text-[#111214] shadow-md transition hover:bg-neutral-100 active:scale-95"
            >
              <span>
                {t("Compare")} ({selectedCars.length}/4)
              </span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
