import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { brands, cars } from "@/lib/data";

export const metadata = {
  title: "Marques & Brands — Aurelia Motors",
  description:
    "Explore our collection by manufacturer, from celebrated performance houses to modern electric pioneers.",
};

const logoSlugs: Record<string, string> = {
  Toyota: "toyota",
  BMW: "bmw",
  "Mercedes-Benz": "mercedesbenz",
  Audi: "audi",
  Porsche: "porsche",
  Ford: "ford",
  Honda: "honda",
  Tesla: "tesla",
  Lexus: "lexus",
  Lamborghini: "lamborghini",
};

export default function Brands() {
  return (
    <div className="container section">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-neutral-200/80 pb-10 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#ef3f32]" />
            <p className="eyebrow">Iconic marques</p>
          </div>
          <h1 className="serif mt-3 text-4xl font-normal tracking-tight text-[#111214] md:text-6xl">
            Choose your badge.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-500">
            Explore our collection by manufacturer, from celebrated performance houses
            to modern electric pioneers.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 shadow-xs">
          <Sparkles size={14} className="text-[#ef3f32]" />
          <span>{brands.length} Prestigious Marques</span>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
        {brands.map((brand) => {
          const count = cars.filter((car) => car.brand === brand).length;
          return (
            <Link
              className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-2 hover:border-[#111214] hover:shadow-xl"
              key={brand}
              href={`/cars?brand=${encodeURIComponent(brand)}`}
            >
              {/* Background Watermark */}
              <span
                aria-hidden="true"
                className="absolute inset-4 bg-contain bg-center bg-no-repeat opacity-[0.06] grayscale transition-all duration-500 group-hover:scale-115 group-hover:opacity-[0.14]"
                style={{
                  backgroundImage: `url("https://cdn.simpleicons.org/${
                    logoSlugs[brand] || "car"
                  }/111111")`,
                }}
              />

              <div className="relative z-10 flex flex-col items-center">
                {/* Icon Container */}
                <span className="grid size-12 place-items-center rounded-2xl bg-neutral-100 text-neutral-800 transition duration-300 group-hover:bg-[#111214] group-hover:text-white group-hover:shadow-md">
                  <span
                    className="size-6 bg-contain bg-center bg-no-repeat grayscale group-hover:invert"
                    style={{
                      backgroundImage: `url("https://cdn.simpleicons.org/${
                        logoSlugs[brand] || "car"
                      }/111111")`,
                    }}
                  />
                </span>

                <h2 className="mt-4 text-base font-extrabold tracking-tight text-neutral-900 group-hover:text-[#ef3f32] transition-colors">
                  {brand}
                </h2>
                <p className="mt-1 text-xs font-semibold text-neutral-400">
                  {count} {count === 1 ? "vehicle" : "vehicles"}
                </p>

                <span className="mt-3 grid size-6 place-items-center rounded-full bg-neutral-50 text-neutral-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:bg-[#ef3f32] group-hover:text-white">
                  <ArrowUpRight size={13} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
