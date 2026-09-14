"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Sparkles,
  Gauge,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  Users,
  Compass,
  HeartHandshake,
  Star,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const STATS = [
  { label: "Vehicles Delivered", value: "1,200+", sub: "Across the region" },
  { label: "Inspection Points", value: "150", sub: "Rigorously verified" },
  { label: "Client Satisfaction", value: "99.4%", sub: "5-star rating average" },
  { label: "Global Marques", value: "10+", sub: "Curated manufacturers" },
];

const PILLARS = [
  {
    icon: Compass,
    title: "Curated Selection",
    kmTitle: "ការជ្រើសរើសដោយយកចិត្តទុកដាក់",
    description:
      "We reject over 90% of prospective inventory. Only vehicles with verified histories, exceptional cosmetics, and flawless mechanical provenance earn a spot on our showroom floor.",
  },
  {
    icon: ShieldCheck,
    title: "150-Point Certification",
    kmTitle: "ការត្រួតពិនិត្យ ១៥០ ចំណុច",
    description:
      "Every vehicle undergoes an exhaustive mechanical, electronic, bodywork, and road-test evaluation by master technicians before receiving the Aurelia Certified stamp.",
  },
  {
    icon: HeartHandshake,
    title: "Transparent Provenance",
    kmTitle: "តម្លាភាព និងប្រវត្តិជាក់ស្តែង",
    description:
      "No hidden fees, no opaque histories. Complete service documentation, clean titles, and transparent pricing guarantee total peace of mind for every collector and driver.",
  },
  {
    icon: Users,
    title: "Private Client Concierge",
    kmTitle: "អ្នកជំនាញផ្ទាល់ខ្លួន",
    description:
      "A dedicated specialist accompanies your journey from initial walkaround to bespoke delivery, financing structuring, and post-sale care.",
  },
];

const TEAM = [
  {
    name: "Vannak Samnang",
    role: "Founder & Managing Director",
    quote: "Cars have always been about emotion for me. We built Aurelia to honor that passion.",
  },
  {
    name: "Elena Rostova",
    role: "Chief Vehicle Appraiser & Quality Lead",
    quote: "Our inspection standards are uncompromising. If a vehicle isn't exceptional, it's not here.",
  },
  {
    name: "David Sterling",
    role: "Head of Client Experience",
    quote: "Acquiring a performance car should feel as rewarding as driving it on an open coastal road.",
  },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0d0e11] py-24 text-white lg:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85"
            alt="Aurelia Motors Showroom"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e11] via-[#0d0e11]/80 to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#ef3f32] backdrop-blur-md">
              <Sparkles size={13} />
              <span>The Aurelia Legacy</span>
            </div>

            <h1 className="serif mt-6 text-4xl font-normal tracking-tight text-white sm:text-5xl lg:text-6xl">
              The art of automotive curation.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-neutral-300">
              {t(
                "Founded by lifelong enthusiasts, Aurelia exists to make the world’s most engaging cars easier to discover and more rewarding to own. Every vehicle is selected for its condition, provenance, and the feeling it creates from behind the wheel."
              )}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/cars"
                className="btn btn-accent px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#ef3f32]/25"
              >
                {t("Browse the collection")}
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20"
              >
                {t("Contact")} Showroom
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-neutral-100 bg-[#fafafb] py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center lg:text-left">
                <p className="text-3xl font-black tracking-tight text-[#111214] sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-bold text-neutral-800">{stat.label}</p>
                <p className="text-xs text-neutral-400">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy & Pillars */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ef3f32]">
              {t("The Aurelia standard")}
            </span>
            <h2 className="serif mt-3 text-3xl font-normal tracking-tight text-[#111214] sm:text-4xl">
              {t("Confidence at every turn.")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500">
              {t(
                "Buying a remarkable car should feel remarkable. Our process is transparent, personal, and built around complete peace of mind."
              )}
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-xs transition duration-300 hover:-translate-y-1.5 hover:border-neutral-300 hover:shadow-xl hover:shadow-black/[0.04]"
                >
                  <div>
                    <div className="grid size-12 place-items-center rounded-2xl bg-neutral-100 text-neutral-900 transition-colors duration-300 group-hover:bg-[#ef3f32] group-hover:text-white">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-6 text-lg font-bold text-[#111214]">
                      {t(pillar.title)}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#ef3f32]">
                    <CheckCircle2 size={15} />
                    <span>Aurelia Certified Standard</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Showroom & Private Lounge Showcase */}
      <section className="bg-[#111214] py-20 text-white lg:py-28">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ef3f32]">
                Flagship Experience
              </span>
              <h2 className="serif text-3xl font-normal sm:text-4xl lg:text-5xl">
                The Norodom Boulevard Showroom
              </h2>
              <p className="text-sm leading-relaxed text-neutral-300">
                Designed to echo the refined aesthetics of contemporary art galleries, our flagship showroom offers a serene, climate-controlled sanctuary where each automobile is presented with gallery-grade lighting and unhurried privacy.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/10 text-[#ef3f32]">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Norodom Boulevard, Phnom Penh</p>
                    <p className="text-xs text-neutral-400">Convenient central access with private valet parking</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/10 text-[#ef3f32]">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Monday through Sunday</p>
                    <p className="text-xs text-neutral-400">9:00 AM – 7:00 PM · Private appointments available after-hours</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ef3f32] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#d93427]"
                >
                  <span>Book a Private Visit</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Showroom Visual Collage */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85"
                alt="Aurelia Private Lounge"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#ef3f32]">
                    Private Client Lounge
                  </p>
                  <p className="text-xs text-neutral-300">
                    Complimentary espresso bar & bespoke handover suite
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-400">
                  Open Today
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Specialists */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ef3f32]">
              Specialist Leadership
            </span>
            <h2 className="serif mt-3 text-3xl font-normal tracking-tight text-[#111214] sm:text-4xl">
              Driven by Passion and Precision
            </h2>
            <p className="mt-4 text-sm text-neutral-500">
              Meet the specialists dedicated to ensuring every transaction is seamless and rewarding.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {TEAM.map((member, i) => (
              <div
                key={i}
                className="group flex flex-col justify-between rounded-3xl border border-neutral-200 bg-neutral-50/50 p-7 transition duration-300 hover:border-neutral-300 hover:bg-white hover:shadow-xl hover:shadow-black/[0.04]"
              >
                <div>
                  <div className="grid size-11 place-items-center rounded-2xl bg-neutral-100 text-[#111214] transition-colors duration-300 group-hover:bg-[#ef3f32] group-hover:text-white">
                    <Users size={20} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-neutral-900">{member.name}</h3>
                  <p className="text-xs font-semibold text-[#ef3f32]">{member.role}</p>
                  <p className="mt-4 text-xs leading-relaxed italic text-neutral-500">
                    “{member.quote}”
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Commitment Guarantee */}
      <section className="border-t border-neutral-200/80 bg-[#fafafb] py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="grid size-10 place-items-center rounded-xl bg-neutral-100 text-[#ef3f32]">
                <ShieldCheck size={20} />
              </div>
              <h4 className="mt-4 text-base font-bold text-neutral-900">
                7-Day / 500-Mile Exchange
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                Change your mind? Seamlessly exchange your vehicle for any other listing in our collection without hassle.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="grid size-10 place-items-center rounded-xl bg-neutral-100 text-[#ef3f32]">
                <Award size={20} />
              </div>
              <h4 className="mt-4 text-base font-bold text-neutral-900">
                Comprehensive Warranty Backing
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                Certified vehicles include full powertrain and electronic protection, backed by certified marque service centers.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="grid size-10 place-items-center rounded-xl bg-neutral-100 text-[#ef3f32]">
                <Sparkles size={20} />
              </div>
              <h4 className="mt-4 text-base font-bold text-neutral-900">
                White-Glove Delivery
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                Enclosed trailer transportation directly to your residence, complete with a full orientation and documentation pack.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
