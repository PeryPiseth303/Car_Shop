import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Check,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Calendar,
  Gauge,
  Zap,
  Flame,
  Settings2,
  Compass,
  Palette,
  Armchair,
  CheckCircle2,
  Award,
} from "lucide-react";
import { cars } from "@/lib/data";
import { money, number } from "@/lib/utils";
import { ImageGallery } from "@/components/cars/image-gallery";
import { DetailActions } from "@/components/cars/detail-actions";
import { CarGrid } from "@/components/cars/car-grid";
import { FavoriteButton } from "@/components/cars/favorite-button";
export function generateStaticParams() {
  return cars.map((c) => ({ id: c.id }));
}

export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = cars.find((c) => c.id === id);
  if (!car) notFound();

  const specs = [
    { label: "Year", value: car.year, Icon: Calendar },
    { label: "Mileage", value: `${number(car.mileage)} mi`, Icon: Gauge },
    { label: "Engine", value: car.engine, Icon: Flame },
    { label: "Horsepower", value: `${car.horsepower} hp`, Icon: Zap },
    { label: "Transmission", value: car.transmission, Icon: Settings2 },
    { label: "Fuel", value: car.fuelType, Icon: Flame },
    { label: "Drive type", value: car.driveType, Icon: Compass },
    { label: "Exterior", value: car.color, Icon: Palette },
    { label: "Interior", value: car.interiorColor, Icon: Armchair },
    { label: "Seats", value: `${car.seats} seats`, Icon: Armchair },
  ];

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-400">
        <Link href="/" className="transition hover:text-neutral-900">
          Home
        </Link>
        <ChevronRight size={13} className="text-neutral-300" />
        <Link href="/cars" className="transition hover:text-neutral-900">
          Cars
        </Link>
        <ChevronRight size={13} className="text-neutral-300" />
        <span className="truncate text-neutral-900">
          {car.brand} {car.model}
        </span>
      </nav>

      {/* Main Image Gallery */}
      <ImageGallery images={car.images} name={`${car.brand} ${car.model}`} />

      {/* Main Grid: Details & Sticky Action Sidebar */}
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Vehicle Content */}
        <article className="space-y-12">
          {/* Header Block */}
          <div className="border-b border-neutral-200/80 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#111214] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
                  {car.brand}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                  <ShieldCheck size={13} />
                  {car.condition}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FavoriteButton id={car.id} size="md" />
              </div>
            </div>

            <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
              <h1 className="serif text-4xl font-normal tracking-tight text-[#111214] md:text-5xl">
                {car.brand} {car.model}
              </h1>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-black text-[#111214]">
                  {money(car.price)}
                </p>
                <p className="text-xs font-semibold text-neutral-400">
                  Est. ${(car.price / 60).toFixed(0)}/mo · 60 mos
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#ef3f32]" />
                {car.location}
              </span>
              <span className="text-neutral-300">•</span>
              <span>Stock #AU{car.id.padStart(4, "0")}</span>
              <span className="text-neutral-300">•</span>
              <span className="text-emerald-600 font-bold">In Stock & Verified</span>
            </div>
          </div>

          {/* Specifications Matrix */}
          <section>
            <div className="mb-6 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#ef3f32]" />
              <h2 className="serif text-2xl font-normal text-[#111214]">
                Vehicle overview
              </h2>
            </div>

            <p className="leading-relaxed text-neutral-600">
              {car.description} Our specialists have verified its provenance,
              mechanical health, and cosmetic finish, ensuring you drive away with
              complete peace of mind.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {specs.map(({ label, value, Icon }) => (
                <div
                  className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs transition hover:border-neutral-300"
                  key={label}
                >
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Icon size={15} />
                    <p className="text-[10px] font-extrabold uppercase tracking-wider">
                      {label}
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-bold text-neutral-900 truncate" title={String(value)}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Features & Technology Checklist */}
          <section className="rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-xs">
            <div className="mb-6 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#ef3f32]" />
              <h2 className="serif text-2xl font-normal text-[#111214]">
                Features &amp; technology
              </h2>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              {[
                ...car.features,
                "Blind spot monitoring",
                "Lane keeping assistance",
                "Emergency braking",
                "Parking sensors",
              ].map((f) => (
                <div
                  className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 text-xs font-bold text-neutral-800"
                  key={f}
                >
                  <span className="grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Dealership & Location Map */}
          <section className="rounded-3xl border border-neutral-200/80 bg-[#f8f8f5] p-7 shadow-xs">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <p className="eyebrow">Flagship Showroom</p>
                <h2 className="serif mt-1 text-2xl font-normal text-[#111214]">
                  Aurelia Phnom Penh
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Open for Viewing
              </span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-neutral-500">
              Officially inspected and presented by our flagship team. Delivery is
              available nationwide with white-glove transport.
            </p>

            <div className="mt-6 h-64 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 shadow-inner">
              <iframe
                title="Aurelia Motors in Phnom Penh, Cambodia"
                src="https://www.google.com/maps?q=Norodom+Boulevard,+Phnom+Penh,+Cambodia&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </section>
        </article>

        {/* Right Column: Sticky Action Box */}
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {/* Main Action Card */}
          <div className="card p-6 shadow-lg">
            {/* Protection Badge */}
            <div className="mb-6 flex items-start gap-3.5 border-b border-neutral-100 pb-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#fff0ee] text-[#ef3f32]">
                <ShieldCheck size={22} />
              </span>
              <div>
                <p className="font-extrabold text-neutral-900">Aurelia Certified</p>
                <p className="text-xs text-neutral-500">
                  Inspected. Protected. Ready.
                </p>
              </div>
            </div>

            {/* Price Highlight */}
            <div className="mb-6 rounded-xl bg-neutral-50 p-4">
              <p className="text-xs font-semibold text-neutral-400">Total Price</p>
              <p className="text-2xl font-black text-neutral-900">{money(car.price)}</p>
              <p className="mt-1 text-[11px] text-neutral-500">
                Includes 150-point inspection certificate
              </p>
            </div>

            {/* Actions */}
            <DetailActions id={car.id} />

            {/* Quick Guarantees */}
            <div className="mt-6 space-y-2.5 border-t border-neutral-100 pt-5 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>7-Day exchange policy</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-emerald-600 shrink-0" />
                <span>12-Month warranty option</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Vehicles Section */}
      <section className="section border-t border-neutral-200/80 mt-16 bg-transparent">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="eyebrow mb-2">Curated recommendations</p>
            <h2 className="serif text-3xl md:text-4xl">You may also like</h2>
          </div>
          <Link
            href="/cars"
            className="text-xs font-bold uppercase tracking-wider text-[#ef3f32] hover:underline"
          >
            View all
          </Link>
        </div>
        <CarGrid
          cars={cars.filter((c) => c.id !== car.id).slice(0, 3)}
        />
      </section>
    </div>
  );
}

