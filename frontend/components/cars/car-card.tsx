import Image from "next/image";
import Link from "next/link";
import { Fuel, Gauge, MapPin, Settings2, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Car } from "@/types/car";
import { money, number } from "@/lib/utils";
import { FavoriteButton } from "./favorite-button";
import { CompareButton } from "./compare-button";

export function CarCard({ car }: { car: Car }) {
  const isCertified = car.condition === "Certified";

  return (
    <Link
      href={`/cars/${car.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-neutral-400/80 hover:shadow-xl hover:shadow-black/[0.06]"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-[16/10.2] w-full overflow-hidden bg-neutral-100">
        <Image
          src={car.images[0]}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-60" />

        {/* Condition Tag */}
        <div className="absolute left-3.5 top-3.5">
          {isCertified ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 backdrop-blur-md shadow-xs">
              <ShieldCheck size={12} className="text-emerald-400" />
              Certified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/75 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md shadow-xs">
              <span className="size-1.5 rounded-full bg-[#ef3f32]" />
              New
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-1.5">
          <CompareButton id={car.id} size="sm" />
          <FavoriteButton id={car.id} size="sm" />
        </div>

        {/* Year Pill bottom left inside image */}
        <div className="absolute bottom-3 left-3.5">
          <span className="rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
            {car.year}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Brand & Model */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#ef3f32]">
              {car.brand}
            </p>
            <h3 className="mt-0.5 text-lg font-bold tracking-tight text-[#111214] transition-colors group-hover:text-[#ef3f32]">
              {car.model}
            </h3>
          </div>
          <p className="text-lg font-extrabold text-[#111214]">{money(car.price)}</p>
        </div>

        {/* Key Specs Row */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-neutral-100 bg-neutral-50/80 p-2.5 text-[11px] font-semibold text-neutral-600">
          <span className="flex items-center gap-1.5 truncate" title={`${number(car.mileage)} mi`}>
            <Gauge size={13} className="shrink-0 text-neutral-400" />
            <span className="truncate">{number(car.mileage)} mi</span>
          </span>
          <span className="flex items-center gap-1.5 truncate" title={car.transmission}>
            <Settings2 size={13} className="shrink-0 text-neutral-400" />
            <span className="truncate">{car.transmission === "Automatic" ? "Auto" : "Manual"}</span>
          </span>
          <span className="flex items-center gap-1.5 truncate" title={car.fuelType}>
            <Fuel size={13} className="shrink-0 text-neutral-400" />
            <span className="truncate">{car.fuelType}</span>
          </span>
        </div>

        {/* Location & View CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5 truncate">
            <MapPin size={13} className="shrink-0 text-neutral-400" />
            <span className="truncate">{car.location}</span>
          </span>
          <span className="grid size-7.5 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-700 transition-all duration-300 group-hover:bg-[#ef3f32] group-hover:text-white group-hover:shadow-xs">
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
