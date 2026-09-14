"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftRight,
  Plus,
  X,
  ShieldCheck,
  Check,
  Minus,
  Sparkles,
  Zap,
  Gauge,
  Calendar,
  Flame,
  Settings2,
  Compass,
  Palette,
  Armchair,
  MapPin,
  HelpCircle,
  Share2,
  Printer,
  ChevronRight,
} from "lucide-react";
import { useLocalCars } from "@/hooks/use-local-cars";
import { cars } from "@/lib/data";
import { money, number } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { Car } from "@/types/car";

const ALL_FEATURES = [
  "Premium sound system",
  "Adaptive cruise control",
  "360° camera",
  "Heated seats",
  "Wireless Apple CarPlay",
  "Panoramic glass roof",
  "Blind spot monitoring",
  "Sport exhaust system",
  "Lane keeping assist",
  "Carbon ceramic brakes",
];

const PRESETS = [
  {
    title: "High-Performance Coupes",
    subtitle: "Porsche 911 Carrera vs BMW M4 vs AMG GT 55",
    ids: ["1", "2", "3"],
  },
  {
    title: "Electrified Flagships",
    subtitle: "Tesla Model S Plaid vs Audi RS e-tron GT vs BMW i7",
    ids: ["6", "4", "13"],
  },
  {
    title: "Luxury SUVs",
    subtitle: "Range Rover Sport vs Porsche Cayenne S vs Mercedes G 550",
    ids: ["5", "12", "14"],
  },
];

export default function ComparePage() {
  const { ids, toggle } = useLocalCars("compare");
  const { t } = useLanguage();
  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const selectedCars = ids
    .map((id) => cars.find((c) => c.id === id))
    .filter(Boolean) as Car[];

  // Max 4 slots
  const slots: (Car | null)[] = [
    selectedCars[0] || null,
    selectedCars[1] || null,
    selectedCars[2] || null,
    selectedCars[3] || null,
  ];

  const availableCars = cars.filter((c) => !ids.includes(c.id));

  const handleSelectCarForSlot = (carId: string) => {
    if (!ids.includes(carId)) {
      toggle(carId);
    }
    setSelectedSlotIndex(null);
  };

  const clearAll = () => {
    ids.forEach((id) => toggle(id));
  };

  const loadPreset = (presetIds: string[]) => {
    clearAll();
    // small timeout to let state flush
    setTimeout(() => {
      presetIds.forEach((id) => toggle(id));
    }, 50);
  };

  // Helper to determine if values in a row are different across selected cars
  const isRowDifferent = (getValue: (car: Car) => any) => {
    if (selectedCars.length <= 1) return false;
    const firstVal = getValue(selectedCars[0]);
    return selectedCars.some((c) => getValue(c) !== firstVal);
  };

  return (
    <div className="min-h-screen bg-[#fafafb] pb-24">
      {/* Breadcrumb Header */}
      <div className="border-b border-neutral-200/80 bg-white">
        <div className="container py-8">
          <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-neutral-400">
            <Link href="/" className="transition hover:text-neutral-900">
              {t("Home")}
            </Link>
            <ChevronRight size={13} className="text-neutral-300" />
            <Link href="/cars" className="transition hover:text-neutral-900">
              {t("Cars")}
            </Link>
            <ChevronRight size={13} className="text-neutral-300" />
            <span className="truncate text-neutral-900">{t("Compare")}</span>
          </nav>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-neutral-800">
                <ArrowLeftRight size={13} className="text-[#ef3f32]" />
                <span>Side-by-Side Matrix</span>
              </div>
              <h1 className="serif mt-3 text-3xl font-normal tracking-tight text-[#111214] sm:text-4xl md:text-5xl">
                {t("Vehicle Comparison")}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-neutral-500">
                {t("Compare specifications, powertrain metrics, dimensions, and standard amenities across up to four vehicles.")}
              </p>
            </div>

            {selectedCars.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setHighlightDiffs(!highlightDiffs)}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                    highlightDiffs
                      ? "border-[#ef3f32] bg-[#ef3f32]/10 text-[#ef3f32]"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  <Sparkles size={14} />
                  <span>Highlight Differences</span>
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-bold text-neutral-600 transition hover:bg-neutral-50 hover:text-red-600"
                >
                  {t("Reset all")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mt-8">
        {selectedCars.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm md:p-14">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-neutral-100 text-neutral-400">
              <ArrowLeftRight size={28} />
            </div>
            <h2 className="serif mt-5 text-2xl font-normal text-[#111214] sm:text-3xl">
              No vehicles selected for comparison
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
              Browse our inventory and tap the comparison icon on any vehicle card, or quickly load one of our curated comparison presets below.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/cars"
                className="btn btn-accent px-6 py-2.5 text-xs font-bold tracking-wide"
              >
                {t("Browse cars")}
              </Link>
            </div>

            {/* Presets Grid */}
            <div className="mt-14 border-t border-neutral-100 pt-10 text-left">
              <p className="text-center text-xs font-extrabold uppercase tracking-widest text-neutral-400">
                Or explore popular matchups
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => loadPreset(preset.ids)}
                    className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 text-left transition hover:-translate-y-1 hover:border-[#ef3f32]/40 hover:bg-white hover:shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#ef3f32]">
                          Matchup
                        </span>
                        <ArrowLeftRight
                          size={15}
                          className="text-neutral-400 transition-transform group-hover:rotate-180 group-hover:text-[#ef3f32]"
                        />
                      </div>
                      <h4 className="mt-2 text-base font-bold text-neutral-900">
                        {preset.title}
                      </h4>
                      <p className="mt-1 text-xs text-neutral-500">{preset.subtitle}</p>
                    </div>

                    <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-neutral-800 group-hover:text-[#ef3f32]">
                      <span>Compare these 3 cars</span>
                      <ChevronRight size={14} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Comparison Table & Cards */
          <div className="space-y-8">
            {/* Top Vehicles Sticky Header Cards */}
            <div className="overflow-x-auto rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6">
              <div className="grid min-w-[700px] grid-cols-4 gap-4">
                {slots.map((car, idx) => {
                  if (car) {
                    return (
                      <div
                        key={car.id}
                        className="relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-neutral-50/50 p-4 transition hover:border-neutral-300 hover:bg-white hover:shadow-md"
                      >
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => toggle(car.id)}
                          aria-label={`Remove ${car.model}`}
                          className="absolute right-2.5 top-2.5 z-10 grid size-7 place-items-center rounded-full bg-white/90 text-neutral-400 shadow-xs transition hover:bg-red-50 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>

                        <div>
                          {/* Image */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-200">
                            <Image
                              src={car.images[0]}
                              alt={`${car.brand} ${car.model}`}
                              fill
                              className="object-cover"
                              sizes="200px"
                            />
                            <div className="absolute left-2 top-2">
                              <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                                {car.year}
                              </span>
                            </div>
                          </div>

                          {/* Brand & Model */}
                          <div className="mt-3">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#ef3f32]">
                              {car.brand}
                            </p>
                            <h3 className="line-clamp-1 text-base font-bold text-neutral-900">
                              {car.model}
                            </h3>
                            <p className="mt-1 text-lg font-black text-neutral-900">
                              {money(car.price)}
                            </p>
                            <p className="text-[11px] font-semibold text-neutral-400">
                              Est. ${(car.price / 60).toFixed(0)}/mo
                            </p>
                          </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-4 flex flex-col gap-2">
                          <Link
                            href={`/cars/${car.id}`}
                            className="w-full rounded-xl bg-[#111214] py-2 text-center text-xs font-bold text-white transition hover:bg-[#ef3f32]"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`empty-slot-${idx}`}
                      className="relative flex min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/40 p-4 text-center transition hover:border-neutral-300 hover:bg-neutral-50"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSlotIndex(selectedSlotIndex === idx ? null : idx)
                        }
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className="grid size-12 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-400 shadow-xs transition group-hover:scale-105 group-hover:border-[#ef3f32] group-hover:text-[#ef3f32]">
                          <Plus size={20} />
                        </div>
                        <span className="text-xs font-bold text-neutral-600 group-hover:text-neutral-900">
                          Add Vehicle
                        </span>
                        <span className="text-[10px] text-neutral-400">Slot {idx + 1} of 4</span>
                      </button>

                      {/* Dropdown Selector Popover */}
                      {selectedSlotIndex === idx && (
                        <div className="absolute inset-x-2 bottom-2 top-2 z-20 flex flex-col rounded-2xl border border-neutral-200 bg-white p-3 shadow-2xl">
                          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                            <span className="text-xs font-bold text-neutral-800">
                              Select from Inventory
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedSlotIndex(null)}
                              className="text-neutral-400 hover:text-neutral-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="mt-2 flex-1 overflow-y-auto space-y-1 text-left">
                            {availableCars.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => handleSelectCarForSlot(c.id)}
                                className="w-full rounded-lg px-2.5 py-1.5 text-left transition hover:bg-neutral-100"
                              >
                                <p className="text-xs font-bold text-neutral-900">
                                  {c.brand} {c.model}
                                </p>
                                <p className="text-[10px] text-neutral-500">
                                  {c.year} · {money(c.price)}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Specifications Comparison Matrix */}
            <div className="overflow-x-auto rounded-3xl border border-neutral-200 bg-white shadow-sm">
              <div className="min-w-[700px]">
                {/* SECTION 1: Performance & Powertrain */}
                <div className="border-b border-neutral-100 bg-neutral-100/60 px-6 py-3.5">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#111214] flex items-center gap-2">
                    <Zap size={14} className="text-[#ef3f32]" />
                    Performance & Powertrain
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 text-sm">
                  {[
                    {
                      label: "Horsepower",
                      Icon: Zap,
                      getValue: (c: Car) => `${c.horsepower} hp`,
                    },
                    {
                      label: "Engine Configuration",
                      Icon: Flame,
                      getValue: (c: Car) => c.engine,
                    },
                    {
                      label: "Transmission",
                      Icon: Settings2,
                      getValue: (c: Car) => c.transmission,
                    },
                    {
                      label: "Drive Type",
                      Icon: Compass,
                      getValue: (c: Car) => c.driveType,
                    },
                    {
                      label: "Fuel Type",
                      Icon: Flame,
                      getValue: (c: Car) => c.fuelType,
                    },
                  ].map(({ label, Icon, getValue }) => {
                    const diff = isRowDifferent(getValue);
                    return (
                      <div
                        key={label}
                        className={`grid grid-cols-[180px_repeat(4,1fr)] items-center px-6 py-4 transition ${
                          highlightDiffs && diff
                            ? "bg-amber-50/50"
                            : "hover:bg-neutral-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                          <Icon size={14} className="text-neutral-400" />
                          <span>{label}</span>
                        </div>
                        {slots.map((car, i) => (
                          <div key={i} className="px-2 font-semibold text-neutral-800">
                            {car ? getValue(car) : "—"}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* SECTION 2: Key Specifications & Dimensions */}
                <div className="border-b border-t border-neutral-100 bg-neutral-100/60 px-6 py-3.5">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#111214] flex items-center gap-2">
                    <Gauge size={14} className="text-[#ef3f32]" />
                    Key Dimensions & Specs
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 text-sm">
                  {[
                    {
                      label: "Model Year",
                      Icon: Calendar,
                      getValue: (c: Car) => c.year,
                    },
                    {
                      label: "Mileage",
                      Icon: Gauge,
                      getValue: (c: Car) => `${number(c.mileage)} mi`,
                    },
                    {
                      label: "Body Style",
                      Icon: Compass,
                      getValue: (c: Car) => c.bodyType,
                    },
                    {
                      label: "Seating Capacity",
                      Icon: Armchair,
                      getValue: (c: Car) => `${c.seats} seats`,
                    },
                    {
                      label: "Exterior Color",
                      Icon: Palette,
                      getValue: (c: Car) => c.color,
                    },
                    {
                      label: "Interior Finish",
                      Icon: Armchair,
                      getValue: (c: Car) => c.interiorColor,
                    },
                    {
                      label: "Condition / Warranty",
                      Icon: ShieldCheck,
                      getValue: (c: Car) => c.condition,
                    },
                    {
                      label: "Showroom Hub",
                      Icon: MapPin,
                      getValue: (c: Car) => c.location,
                    },
                  ].map(({ label, Icon, getValue }) => {
                    const diff = isRowDifferent(getValue);
                    return (
                      <div
                        key={label}
                        className={`grid grid-cols-[180px_repeat(4,1fr)] items-center px-6 py-4 transition ${
                          highlightDiffs && diff
                            ? "bg-amber-50/50"
                            : "hover:bg-neutral-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                          <Icon size={14} className="text-neutral-400" />
                          <span>{label}</span>
                        </div>
                        {slots.map((car, i) => (
                          <div key={i} className="px-2 font-semibold text-neutral-800">
                            {car ? getValue(car) : "—"}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* SECTION 3: Features & Amenities Checklist */}
                <div className="border-b border-t border-neutral-100 bg-neutral-100/60 px-6 py-3.5">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#111214] flex items-center gap-2">
                    <Sparkles size={14} className="text-[#ef3f32]" />
                    Features & Standard Amenities
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 text-sm">
                  {ALL_FEATURES.map((feature) => {
                    const hasFeatureCheck = (c: Car) =>
                      c.features?.some(
                        (f) => f.toLowerCase() === feature.toLowerCase()
                      ) || false;
                    const diff = isRowDifferent(hasFeatureCheck);

                    return (
                      <div
                        key={feature}
                        className={`grid grid-cols-[180px_repeat(4,1fr)] items-center px-6 py-3.5 transition ${
                          highlightDiffs && diff
                            ? "bg-amber-50/50"
                            : "hover:bg-neutral-50/50"
                        }`}
                      >
                        <div className="text-xs font-bold text-neutral-600">
                          {feature}
                        </div>
                        {slots.map((car, i) => {
                          if (!car) {
                            return (
                              <div key={i} className="px-2 text-neutral-300">
                                —
                              </div>
                            );
                          }
                          const hasIt = hasFeatureCheck(car);
                          return (
                            <div key={i} className="px-2">
                              {hasIt ? (
                                <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                  <Check size={14} className="stroke-[2.5]" />
                                </span>
                              ) : (
                                <span className="inline-flex size-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                                  <Minus size={14} />
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Concierge Assistance Banner */}
            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-neutral-800 bg-[#111214] p-8 text-white sm:flex-row sm:p-10">
              <div>
                <h3 className="serif text-2xl font-normal">
                  Need specialist assistance choosing?
                </h3>
                <p className="mt-1 max-w-lg text-sm text-neutral-400">
                  Our private client advisors are available for custom walk-arounds, live test drive appointments, or trade-in appraisals.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-xl bg-[#ef3f32] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#d93427]"
                >
                  Contact Concierge
                </Link>
                <Link
                  href="/cars"
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
                >
                  Explore More Cars
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
