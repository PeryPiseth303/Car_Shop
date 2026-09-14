"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  ArrowRight,
  Sparkles,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Mail,
  Lock,
  Gauge,
  Calendar,
  Fuel,
  Settings2,
} from "lucide-react";
import { cars } from "@/lib/data";
import { money, number } from "@/lib/utils";
import { useLocalCars } from "@/hooks/use-local-cars";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/context/auth-context";

export default function CartPage() {
  const { ids, toggle } = useLocalCars("cart");
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const cartCars = cars.filter((c) => ids.includes(c.id));
  const totalPrice = cartCars.reduce((sum, c) => sum + c.price, 0);

  function clearAll() {
    ids.forEach((id) => toggle(id));
  }

  return (
    <div className="container py-10 md:py-16">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-400">
        <Link href="/" className="hover:text-neutral-900 transition flex items-center gap-1">
          <ArrowLeft size={13} />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-neutral-800">Cart</span>
      </div>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200/80 pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#ef3f32]" />
            <p className="eyebrow">{t("Saved for purchase")}</p>
          </div>
          <h1 className="serif mt-2 text-4xl font-normal tracking-tight text-[#111214] md:text-5xl">
            {t("Vehicle Cart")}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {isAuthenticated && user?.email ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Synchronized with <strong>{user.email}</strong>
              </span>
            ) : (
              <span>Your selections are saved locally. Sign in with your Gmail to keep them permanently.</span>
            )}
          </p>
        </div>

        {cartCars.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-neutral-400 hover:text-red-600 transition flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              <span>Clear Cart</span>
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-bold text-neutral-700 shadow-xs">
              <ShoppingCart size={14} className="text-[#ef3f32]" />
              <span>
                <strong className="text-[#111214]">{cartCars.length}</strong> {t("Vehicles")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cart Content or Empty State */}
      <div className="mt-10">
        {cartCars.length > 0 ? (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* Left Column: Cart Items List */}
            <div className="space-y-4">
              {cartCars.map((car) => (
                <div
                  key={car.id}
                  className="card p-5 sm:p-6 shadow-xs transition hover:border-neutral-300 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Link
                      href={`/cars/${car.id}`}
                      className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 block group"
                    >
                      <Image
                        src={car.images[0]}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ef3f32]">
                          {car.brand}
                        </span>
                        <span className="text-xs text-neutral-400">•</span>
                        <span className="text-xs font-semibold text-neutral-500">{car.year}</span>
                      </div>
                      <Link
                        href={`/cars/${car.id}`}
                        className="font-bold text-base text-neutral-900 hover:text-[#ef3f32] transition truncate block mt-0.5"
                      >
                        {car.brand} {car.model}
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-medium text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Gauge size={12} className="text-neutral-400" />
                          {number(car.mileage)} mi
                        </span>
                        <span className="flex items-center gap-1">
                          <Settings2 size={12} className="text-neutral-400" />
                          {car.transmission}
                        </span>
                        <span className="flex items-center gap-1">
                          <Fuel size={12} className="text-neutral-400" />
                          {car.fuelType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <p className="text-lg font-black text-neutral-900">{money(car.price)}</p>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/cars/${car.id}`}
                        className="btn btn-outline py-1.5 px-3 text-xs"
                      >
                        Details
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggle(car.id)}
                        title="Remove from cart"
                        className="grid size-8 place-items-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Investment Summary */}
            <aside className="space-y-6">
              <div className="card p-6 shadow-md">
                <h3 className="serif text-xl font-normal text-neutral-900">
                  Cart Summary
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Ready for concierge reservation and paperwork.
                </p>

                <div className="mt-6 space-y-3 border-t border-neutral-100 pt-5 text-xs">
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Selected Vehicles</span>
                    <span className="font-bold text-neutral-900">{cartCars.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Inspection Certificate</span>
                    <span className="font-bold text-emerald-600">Included</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>White-Glove Delivery</span>
                    <span className="font-bold text-emerald-600">Complimentary</span>
                  </div>

                  <div className="border-t border-neutral-200/80 pt-3 flex items-baseline justify-between">
                    <span className="font-extrabold text-neutral-900">Total Investment</span>
                    <span className="text-2xl font-black text-neutral-900">{money(totalPrice)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/contact"
                    className="btn btn-accent w-full py-3.5 text-xs font-bold tracking-wide shadow-md shadow-[#ef3f32]/20 text-center block"
                  >
                    Proceed to Reserve / Enquire
                  </Link>

                  <Link
                    href="/cars"
                    className="btn btn-outline w-full py-3 text-xs text-center block"
                  >
                    Browse More Cars
                  </Link>
                </div>

                <div className="mt-6 border-t border-neutral-100 pt-4 space-y-2 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                    <span>7-Day satisfaction exchange guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>All vehicles inspected with 150-point report</span>
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="card p-5 bg-neutral-50 border-neutral-200/70 text-xs">
                  <div className="flex items-center gap-2 font-bold text-neutral-800">
                    <Mail size={14} className="text-[#ef3f32]" />
                    <span>Permanent Cart Storage</span>
                  </div>
                  <p className="mt-2 text-neutral-500 text-[11px] leading-relaxed">
                    Sign in with your Gmail or account to keep your saved cars synced across all your devices.
                  </p>
                  <Link href="/login" className="btn btn-dark w-full py-2 mt-3 text-xs">
                    Sign In
                  </Link>
                </div>
              )}
            </aside>
          </div>
        ) : (
          <div className="rounded-3xl border border-neutral-200/80 bg-white py-20 px-6 text-center shadow-xs">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#fff0ee] text-[#ef3f32]">
              <ShoppingCart size={36} className="stroke-[1.5]" />
            </span>
            <h2 className="serif mt-6 text-3xl font-normal text-[#111214]">
              {t("Your cart is empty")}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
              {t("Save any vehicle to your cart while browsing our collection. Your selections will be waiting here.")}
            </p>
            <div className="mt-8">
              <Link href="/cars" className="btn btn-dark text-xs px-7 py-3.5">
                <span>{t("Explore showroom")}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
