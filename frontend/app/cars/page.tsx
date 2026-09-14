import { Suspense } from "react";
import { CarsBrowser } from "@/components/cars/cars-browser";

export const metadata = {
  title: "Curated Inventory — Aurelia Motors",
  description: "Explore our collection of meticulously inspected luxury and performance vehicles.",
};

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-14">
          <div className="mb-10 h-16 w-80 animate-pulse rounded-2xl bg-neutral-200/70" />
          <div className="grid gap-8 lg:grid-cols-[270px_1fr]">
            <div className="hidden h-96 rounded-2xl bg-neutral-200/50 lg:block animate-pulse" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-neutral-200/60 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CarsBrowser />
    </Suspense>
  );
}
