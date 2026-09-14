"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Gauge, Zap, Command, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cars } from "@/lib/data";
import { money } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { Car } from "@/types/car";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ["Porsche 911", "Electric", "SUV", "BMW M4", "Coupe", "Certified"];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Global shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter cars based on query & category
  const filteredCars = cars.filter((car) => {
    const matchesCategory =
      activeCategory === "All" ||
      car.bodyType.toLowerCase() === activeCategory.toLowerCase() ||
      (activeCategory === "Electric" && car.fuelType === "Electric");

    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    return (
      car.brand.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q) ||
      car.bodyType.toLowerCase().includes(q) ||
      car.fuelType.toLowerCase().includes(q) ||
      car.color.toLowerCase().includes(q) ||
      String(car.year).includes(q)
    );
  });

  const handleSelectCar = (carId: string) => {
    onClose();
    router.push(`/cars/${carId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-start justify-center overflow-y-auto bg-black/60 p-4 pt-16 sm:pt-24 backdrop-blur-md">
          {/* Backdrop click */}
          <div className="fixed inset-0 -z-10" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl ring-1 ring-black/5"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-neutral-100 px-5 py-4">
              <Search size={20} className="text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("Search make, model, year, body style...") || "Search make, model, year..."}
                className="w-full bg-transparent px-3 text-base font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="grid size-7 place-items-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                >
                  <X size={14} />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-bold text-neutral-400">
                  ESC
                </kbd>
              )}
            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-neutral-100 bg-neutral-50/70 px-5 py-2.5">
              {["All", "Coupe", "SUV", "Sedan", "Electric"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                    activeCategory === cat
                      ? "bg-[#111214] text-white"
                      : "bg-white text-neutral-600 hover:bg-neutral-200/80 border border-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Popular Searches if Query is Empty */}
            {!query && (
              <div className="border-b border-neutral-100 px-5 py-3 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-400 mr-2">Popular:</span>
                <div className="inline-flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="rounded-md bg-neutral-100 px-2 py-0.5 font-medium text-neutral-700 transition hover:bg-neutral-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results List */}
            <div className="max-h-[380px] overflow-y-auto p-3 space-y-1">
              {filteredCars.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-bold text-neutral-800">
                    {t("No exact matches")}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Try searching for another make, model, or body style.
                  </p>
                </div>
              ) : (
                filteredCars.slice(0, 8).map((car) => (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => handleSelectCar(car.id)}
                    className="group flex w-full items-center justify-between gap-3.5 rounded-2xl p-2.5 text-left transition hover:bg-neutral-100/80"
                  >
                    <div className="flex items-center gap-3">
                      {/* Image Thumbnail */}
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-neutral-200">
                        <Image
                          src={car.images[0]}
                          alt={car.model}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ef3f32]">
                            {car.brand}
                          </span>
                          <span className="text-[11px] font-bold text-neutral-400">
                            {car.year}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#ef3f32] transition-colors">
                          {car.brand} {car.model}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                          <span>{car.bodyType}</span>
                          <span>•</span>
                          <span>{car.horsepower} hp</span>
                          <span>•</span>
                          <span>{car.fuelType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-neutral-900">
                        {money(car.price)}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ef3f32] opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Bottom Footer */}
            <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/70 px-5 py-3 text-xs text-neutral-400">
              <span className="font-medium">
                {filteredCars.length} {filteredCars.length === 1 ? "vehicle" : "vehicles"} available
              </span>

              <Link
                href="/cars"
                onClick={onClose}
                className="flex items-center gap-1 font-bold text-neutral-700 hover:text-black"
              >
                <span>View All Inventory</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
