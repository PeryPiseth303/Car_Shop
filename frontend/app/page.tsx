import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  Headphones,
  TrendingUp,
  ArrowUpRight,
  Star,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cars, brands } from "@/lib/data";
import { CarGrid } from "@/components/cars/car-grid";
import { SectionHeading } from "@/components/common/section-heading";

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

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[820px] overflow-hidden bg-[#0d0e11] text-white">
        {/* Background Hero Image with subtle zoom feel */}
        <Image
          priority
          fill
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=90"
          alt="Black luxury sports car on scenic coastal road"
          className="object-cover opacity-60"
        />

        {/* Multi-stop Luxury Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e11] via-transparent to-black/40" />

        {/* Hero Content */}
        <div className="container relative flex min-h-[820px] flex-col justify-center py-24">
          <div className="max-w-3xl">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur-md">
              <span className="size-2 rounded-full bg-[#ef3f32] animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/90">
                Curated performance. Uncompromised service.
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="serif mt-6 text-5xl font-normal leading-[1.02] tracking-tight sm:text-7xl md:text-[86px]">
              Find your <br />
              <span className="italic font-normal text-white/95">perfect drive.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-300 md:text-lg">
              Discover a considered collection of exceptional cars, each inspected, verified, and ready for the road ahead.
            </p>

            {/* Hero CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/cars"
                className="btn btn-accent px-7 py-3.5 text-sm shadow-lg shadow-[#ef3f32]/25"
              >
                <span>Browse cars</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/brands"
                className="btn border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:border-white/40"
              >
                <span>Explore marques</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* Floating Trust Indicators in Hero */}
            <div className="mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3 max-w-lg">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white">
                  <ShieldCheck size={18} className="text-[#ef3f32]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">150-Point Checked</p>
                  <p className="text-[11px] text-neutral-400">Independently certified</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white">
                  <RefreshCcw size={18} className="text-[#ef3f32]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">7-Day Exchange</p>
                  <p className="text-[11px] text-neutral-400">No questions asked</p>
                </div>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white">
                  <Sparkles size={18} className="text-[#ef3f32]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">Direct Delivery</p>
                  <p className="text-[11px] text-neutral-400">Nationwide handover</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="section bg-[#fafaf9]">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Freshly selected"
              title="Featured cars"
              copy="Standout vehicles chosen by our specialists for exceptional condition and provenance."
            />
            <Link
              className="group mb-10 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 shadow-xs transition hover:border-[#111214] hover:bg-[#111214] hover:text-white"
              href="/cars"
            >
              <span>View all inventory</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <CarGrid cars={cars.slice(0, 6)} />
        </div>
      </section>

      {/* Explore by Marque Section */}
      <section className="border-y border-neutral-200/80 bg-[#f4f4f0] py-20 md:py-28">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Explore by marque"
              title="Iconic Manufacturers"
              copy="Browse our curated collection by maker, from high-performance icons to luxurious electric pioneers."
            />
            <Link
              className="group mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ef3f32] transition hover:text-[#d93227]"
              href="/brands"
            >
              <span>View all marques</span>
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5 md:gap-5">
            {brands.map((brandName) => {
              const count = cars.filter((c) => c.brand === brandName).length;
              return (
                <Link
                  href={`/cars?brand=${encodeURIComponent(brandName)}`}
                  key={brandName}
                  className="group relative flex h-44 flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#111214] hover:shadow-xl sm:h-48"
                >
                  {/* Watermark Logo */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-3 -right-3 size-28 bg-contain bg-right-bottom bg-no-repeat opacity-[0.06] grayscale transition-all duration-300 group-hover:scale-110 group-hover:opacity-[0.14]"
                    style={{
                      backgroundImage: `url("https://cdn.simpleicons.org/${
                        logoSlugs[brandName] || "car"
                      }/111111")`,
                    }}
                  />

                  {/* Top Row: Icon Badge & Arrow */}
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-neutral-100/80 text-neutral-800 transition duration-300 group-hover:bg-[#111214] group-hover:text-white">
                      <span
                        className="size-5.5 bg-contain bg-center bg-no-repeat grayscale group-hover:invert"
                        style={{
                          backgroundImage: `url("https://cdn.simpleicons.org/${
                            logoSlugs[brandName] || "car"
                          }/111111")`,
                        }}
                      />
                    </span>
                    <span className="grid size-7 place-items-center rounded-full bg-neutral-50 text-neutral-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:bg-[#ef3f32] group-hover:text-white">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>

                  {/* Bottom Row: Name & Count */}
                  <div className="relative z-10">
                    <h3 className="text-base font-extrabold text-neutral-900 sm:text-lg">
                      {brandName}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-neutral-400 group-hover:text-neutral-600">
                      {count} {count === 1 ? "vehicle" : "vehicles"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Aurelia Standard Section */}
      <section className="section bg-[#fafaf9]">
        <div className="container grid items-center gap-14 lg:grid-cols-2">
          {/* Showroom Image with Floating Card */}
          <div className="relative aspect-[4/4.5] overflow-hidden rounded-[28px] border border-neutral-200/80 shadow-2xl">
            <Image
              fill
              className="object-cover"
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=85"
              alt="Luxury dealership showroom and lounge"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Floating Trust Badge */}
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/90 p-5 backdrop-blur-xl shadow-lg sm:right-auto sm:max-w-xs">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#ef3f32] text-white">
                  <CheckCircle2 size={20} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Guaranteed Provenance
                  </p>
                  <p className="text-sm font-extrabold text-neutral-900">
                    100% Verified History
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pillars Text */}
          <div>
            <SectionHeading
              eyebrow="The Aurelia standard"
              title="Confidence at every turn."
              copy="Buying a remarkable car should feel remarkable. Our process is transparent, personal, and built around complete peace of mind."
            />

            <div className="space-y-6">
              {[
                [
                  ShieldCheck,
                  "150-point inspection",
                  "Every vehicle is independently assessed and reconditioned.",
                ],
                [
                  RefreshCcw,
                  "7-day exchange",
                  "Change your mind? Exchange your vehicle without the stress.",
                ],
                [
                  Headphones,
                  "A dedicated specialist",
                  "One expert stays with you from first question to handover.",
                ],
              ].map(([Icon, title, desc]) => (
                <div
                  className="flex items-start gap-4 rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-xs transition duration-200 hover:border-neutral-300 hover:shadow-md"
                  key={String(title)}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#fff0ee] text-[#ef3f32]">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      {String(title)}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                      {String(desc)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Banner */}
      <section className="border-y border-neutral-800 bg-[#0d0e11] py-20 text-white">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4 md:gap-12">
            {[
              ["1,200+", "Cars delivered"],
              ["18", "Years of expertise"],
              ["4.9/5", "Client rating"],
              ["32", "Trusted partners"],
            ].map(([number, label]) => (
              <div key={label} className="relative">
                <p className="serif text-4xl font-normal tracking-tight text-white md:text-5xl lg:text-6xl">
                  {number}
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Arrived Section */}
      <section className="section bg-[#fafaf9]">
        <div className="container">
          <SectionHeading
            center
            eyebrow="Recently arrived"
            title="New to the collection"
            copy="The latest acquisitions prepared by our curation team."
          />
          <CarGrid cars={cars.slice(8, 11)} />

          <div className="mt-12 text-center">
            <Link href="/cars" className="btn btn-outline px-8 py-3.5 text-xs">
              <span>View all inventory</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Owners' Stories / Testimonials Section */}
      <section className="border-t border-neutral-200/80 bg-[#f4f4f0] py-20 md:py-24">
        <div className="container">
          <SectionHeading
            center
            eyebrow="Owners’ stories"
            title="Driven by trust"
            copy="Real feedback from drivers who found their exceptional vehicles through Aurelia."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "The most refreshingly transparent car purchase I’ve ever made.",
                author: "Marcus V.",
                car: "Porsche 911 Carrera Owner",
              },
              {
                quote: "Every detail was considered—from the first call to delivery day.",
                author: "Elena R.",
                car: "Mercedes-AMG GT Owner",
              },
              {
                quote: "A truly premium experience without the pressure you expect elsewhere.",
                author: "David K.",
                car: "Audi RS e-tron GT Owner",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-7 shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  {/* Star Ratings */}
                  <div className="flex gap-1 text-[#ef3f32]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-[#ef3f32]" />
                    ))}
                  </div>
                  <p className="serif mt-4 text-base italic leading-relaxed text-neutral-800">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 border-t border-neutral-100 pt-4">
                  <p className="text-xs font-bold text-neutral-900">{item.author}</p>
                  <p className="text-[11px] font-semibold text-neutral-400">{item.car}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Newsletter Section */}
      <section className="section bg-[#fafaf9]">
        <div className="container overflow-hidden rounded-[32px] bg-[#111214] p-8 text-white shadow-2xl md:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ef3f32]">
                <TrendingUp size={14} />
                Private Invitations
              </div>
              <h2 className="serif mt-4 text-3.5xl font-normal leading-tight md:text-5xl">
                Stay ahead of the curve.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400 md:text-base">
                New arrivals, buying guides, and private sale invitations—delivered thoughtfully.
              </p>
            </div>

            <form
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 sm:flex-row"
            >
              <input
                type="email"
                required
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-xl bg-white px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-[#ef3f32]"
                placeholder="Your email address"
              />
              <button
                type="submit"
                className="btn btn-accent rounded-xl py-3 px-6 text-xs whitespace-nowrap"
              >
                Join the list
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
