"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, RotateCcw, ChevronDown, Sparkles } from "lucide-react";
import { brands, cars } from "@/lib/data";
import { CarGrid } from "./car-grid";
import { useLanguage } from "@/hooks/use-language";

const fuelTypes = [...new Set(cars.map((car) => car.fuelType))];
const conditions = [...new Set(cars.map((car) => car.condition))];
const colors = [...new Set(cars.map((car) => car.color))];
const years = [...new Set(cars.map((car) => car.year))].sort((a, b) => b - a);

export function CarsBrowser() {
  const params = useSearchParams();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState(params.get("brand") || "");
  const [fuelType, setFuelType] = useState("");
  const [condition, setCondition] = useState("");
  const [color, setColor] = useState("");
  const [year, setYear] = useState("");
  const [maxMileage, setMaxMileage] = useState("");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const found = useMemo(
    () =>
      cars
        .filter(
          (car) =>
            (!brand || car.brand === brand) &&
            (!fuelType || car.fuelType === fuelType) &&
            (!condition || car.condition === condition) &&
            (!color || car.color === color) &&
            (!year || car.year === Number(year)) &&
            (!maxMileage || car.mileage <= Number(maxMileage)) &&
            `${car.brand} ${car.model}`.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) =>
          sort === "low"
            ? a.price - b.price
            : sort === "high"
            ? b.price - a.price
            : b.year - a.year
        ),
    [brand, color, condition, fuelType, maxMileage, query, sort, year]
  );

  const activeFilterCount = [
    brand,
    fuelType,
    condition,
    color,
    year,
    maxMileage,
  ].filter(Boolean).length;

  function resetFilters() {
    setBrand("");
    setFuelType("");
    setCondition("");
    setColor("");
    setYear("");
    setMaxMileage("");
    setQuery("");
  }

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#ef3f32]" />
          <h2 className="text-base font-extrabold text-[#111214]">{t("Filters")}</h2>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#ef3f32] transition hover:underline"
            onClick={resetFilters}
          >
            <RotateCcw size={12} />
            <span>{t("Reset all")}</span>
          </button>
        )}
      </div>

      <FilterSelect
        label={t("Brand")}
        value={brand}
        options={brands}
        onChange={setBrand}
      />
      <FilterSelect
        label={t("Fuel type")}
        value={fuelType}
        options={fuelTypes}
        onChange={setFuelType}
      />
      <FilterSelect
        label={t("Condition")}
        value={condition}
        options={conditions}
        onChange={setCondition}
      />
      <FilterSelect
        label={t("Color")}
        value={color}
        options={colors}
        onChange={setColor}
      />
      <FilterSelect
        label={t("Year")}
        value={year}
        options={years.map(String)}
        onChange={setYear}
      />

      {/* Max Mileage */}
      <div className="border-t border-neutral-100 pt-5">
        <label className="label" htmlFor="max-mileage">
          {t("Maximum mileage")}
        </label>
        <div className="relative">
          <input
            id="max-mileage"
            type="number"
            min="0"
            step="1000"
            value={maxMileage}
            onChange={(event) => setMaxMileage(event.target.value)}
            className="input pr-12"
            placeholder="50,000 mi"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
            mi
          </span>
        </div>

        {/* Quick Mileage Pills */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {["15000", "30000", "50000"].map((miles) => (
            <button
              key={miles}
              type="button"
              onClick={() => setMaxMileage(maxMileage === miles ? "" : miles)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                maxMileage === miles
                  ? "bg-[#111214] text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              &lt; {Number(miles) / 1000}k
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-10 md:py-14">
      {/* Page Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b border-neutral-200/80 pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#ef3f32]" />
            <p className="eyebrow">{t("Curated inventory")}</p>
          </div>
          <h1 className="serif mt-2 text-4xl font-normal tracking-tight text-[#111214] md:text-5xl">
            {t("Cars worth driving.")}
          </h1>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-bold text-neutral-700 shadow-xs">
          <Sparkles size={14} className="text-[#ef3f32]" />
          <span>
            <strong className="text-[#111214]">{found.length}</strong> {t("vehicles")}{" "}
            {t("available")}
          </span>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative min-w-[260px] flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            size={18}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="input pl-11 pr-10 shadow-xs"
            placeholder={t("Search make or model")}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="relative">
          <select
            className="input w-full cursor-pointer appearance-none pr-10 shadow-xs sm:w-auto"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="newest">{t("Newest first")}</option>
            <option value="low">{t("Price: low to high")}</option>
            <option value="high">{t("Price: high to low")}</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setFiltersOpen(true)}
          className="btn btn-outline flex items-center justify-center gap-2 py-3 lg:hidden"
        >
          <SlidersHorizontal size={16} />
          <span>{t("Filters")}</span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-[#ef3f32] px-2 py-0.5 text-[10px] font-extrabold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-neutral-500">Active:</span>
          {brand && (
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-bold text-neutral-800 shadow-xs">
              Brand: {brand}
              <button onClick={() => setBrand("")} className="hover:text-[#ef3f32]">
                <X size={13} />
              </button>
            </span>
          )}
          {fuelType && (
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-bold text-neutral-800 shadow-xs">
              Fuel: {fuelType}
              <button onClick={() => setFuelType("")} className="hover:text-[#ef3f32]">
                <X size={13} />
              </button>
            </span>
          )}
          {condition && (
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-bold text-neutral-800 shadow-xs">
              {condition}
              <button onClick={() => setCondition("")} className="hover:text-[#ef3f32]">
                <X size={13} />
              </button>
            </span>
          )}
          {color && (
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-bold text-neutral-800 shadow-xs">
              Color: {color}
              <button onClick={() => setColor("")} className="hover:text-[#ef3f32]">
                <X size={13} />
              </button>
            </span>
          )}
          {year && (
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-bold text-neutral-800 shadow-xs">
              Year: {year}
              <button onClick={() => setYear("")} className="hover:text-[#ef3f32]">
                <X size={13} />
              </button>
            </span>
          )}
          {maxMileage && (
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-bold text-neutral-800 shadow-xs">
              &lt; {Number(maxMileage).toLocaleString()} mi
              <button onClick={() => setMaxMileage("")} className="hover:text-[#ef3f32]">
                <X size={13} />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-[#ef3f32] hover:underline ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid & Sidebar Layout */}
      <div className="grid gap-8 lg:grid-cols-[270px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
            {sidebarContent}
          </div>
        </aside>

        {/* Cars Results Container */}
        <div>
          {found.length > 0 ? (
            <CarGrid cars={found} />
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-16 text-center shadow-xs">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-neutral-100 text-neutral-400">
                <Search size={28} />
              </div>
              <h3 className="serif mt-6 text-2xl font-normal text-[#111214]">
                {t("No exact matches")}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
                {t("Try adjusting your filters.")}
              </p>
              <button onClick={resetFilters} className="btn btn-dark mt-6 text-xs">
                <RotateCcw size={14} />
                <span>{t("Reset all")}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal Drawer */}
      {filtersOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl"
          >
            {/* Modal Handle */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutral-200" />

            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#ef3f32]" />
                <h3 className="text-lg font-bold text-neutral-900">{t("Filters")}</h3>
              </div>
              <button
                aria-label="Close filters"
                className="grid size-8 place-items-center rounded-full bg-neutral-100 text-neutral-500"
                onClick={() => setFiltersOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4">{sidebarContent}</div>

            <div className="sticky bottom-0 border-t border-neutral-100 bg-white pt-4">
              <button
                onClick={() => setFiltersOpen(false)}
                className="btn btn-dark w-full py-3.5 text-sm"
              >
                {t("Show")} {found.length} {t("Cars")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="border-t border-neutral-100 pt-4">
      <label className="label">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input cursor-pointer appearance-none pr-10 text-xs font-medium"
        >
          <option value="">All {label.toLowerCase()}</option>
          {options.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
        />
      </div>
    </div>
  );
}
