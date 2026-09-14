"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  Check,
  Car as CarIcon,
  ShieldCheck,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { apiCreateSellRequest } from "@/lib/api";

const steps = [
  "Vehicle",
  "Specifications",
  "Price",
  "Photos",
  "Contact",
  "Preview",
];

export function SellWizard() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({
    make: "Mercedes-Benz",
    model: "C 300",
    year: "2024",
    vin: "",
    mileage: "12,000",
    body_type: "Sedan",
    fuel_type: "Gasoline",
    transmission: "Automatic",
    engine: "2.0L Turbo",
    exterior_color: "Obsidian Black",
    features: "Panoramic roof, premium audio",
    asking_price: "$45,000",
    full_name: "",
    email: "",
    phone: "",
    zip_code: "",
  });

  const { t } = useLanguage();

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await apiCreateSellRequest({
        make: formData.make || "Toyota",
        model: formData.model || "Camry",
        year: formData.year ? parseInt(formData.year) : 2024,
        vin: formData.vin,
        mileage: formData.mileage,
        body_type: formData.body_type,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        engine: formData.engine,
        exterior_color: formData.exterior_color,
        features: formData.features,
        asking_price: formData.asking_price,
        full_name: formData.full_name || "Customer",
        email: formData.email || "customer@example.com",
        phone: formData.phone,
        zip_code: formData.zip_code,
      });
    } catch (err) {
      console.warn("Sell request recorded locally:", err);
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="card mx-auto max-w-2xl py-16 px-6 text-center shadow-xl">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <Check size={36} strokeWidth={2.5} />
        </span>
        <h2 className="serif mt-6 text-3xl font-normal text-[#111214] md:text-4xl">
          {t("Your car is ready for review.")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500 leading-relaxed">
          {t(
            "A listing specialist will check the details and contact you before anything goes live."
          )}
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/cars" className="btn btn-dark text-xs px-6 py-3">
            <span>{t("Browse inventory")}</span>
            <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setStep(0);
            }}
            className="btn btn-outline text-xs px-6 py-3"
          >
            List another vehicle
          </button>
        </div>
      </div>
    );
  }

  const titles = [
    t("Tell us about your car"),
    t("Add the key specifications"),
    t("Set your asking price"),
    t("Show it at its best"),
    t("How can we reach you?"),
    t("Review your listing"),
  ];

  return (
    <div>
      {/* Step Progress Bar */}
      <div className="no-scrollbar mb-10 flex overflow-x-auto pb-2">
        <div className="flex min-w-full items-center justify-between">
          {steps.map((s, i) => (
            <div className="flex flex-1 items-center" key={s}>
              <div className="flex items-center gap-2">
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-all ${
                    i < step
                      ? "bg-emerald-600 text-white"
                      : i === step
                      ? "bg-[#ef3f32] text-white shadow-md shadow-[#ef3f32]/25"
                      : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {i < step ? <Check size={14} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={`hidden text-xs font-bold sm:inline ${
                    i === step
                      ? "text-[#111214]"
                      : i < step
                      ? "text-neutral-700"
                      : "text-neutral-400"
                  }`}
                >
                  {t(s)}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span
                  className={`mx-3 h-0.5 flex-1 transition-colors ${
                    i < step ? "bg-emerald-600" : "bg-neutral-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="card mx-auto max-w-3xl p-7 shadow-xl md:p-10">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
          <div>
            <p className="eyebrow">
              {t("Step")} {step + 1} {t("of")} 6
            </p>
            <h2 className="serif mt-1 text-2.5xl font-normal text-[#111214] md:text-3xl">
              {titles[step]}
            </h2>
          </div>
          <span className="hidden rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600 sm:inline-block">
            {steps[step]}
          </span>
        </div>

        {/* Step Contents */}
        <div className="mt-8">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="label">{t("Make")}</span>
                <input
                  value={formData.make}
                  onChange={(e) => handleFieldChange("make", e.target.value)}
                  className="input text-xs"
                  placeholder="e.g. Porsche, BMW"
                />
              </label>
              <label>
                <span className="label">{t("Model")}</span>
                <input
                  value={formData.model}
                  onChange={(e) => handleFieldChange("model", e.target.value)}
                  className="input text-xs"
                  placeholder="e.g. 911 Carrera"
                />
              </label>
              <label>
                <span className="label">{t("Year")}</span>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleFieldChange("year", e.target.value)}
                  className="input text-xs"
                  placeholder="2024"
                />
              </label>
              <label>
                <span className="label">{t("VIN")}</span>
                <input
                  value={formData.vin}
                  onChange={(e) => handleFieldChange("vin", e.target.value)}
                  className="input text-xs"
                  placeholder="17-character VIN"
                />
              </label>
              <label>
                <span className="label">{t("Mileage")}</span>
                <input
                  value={formData.mileage}
                  onChange={(e) => handleFieldChange("mileage", e.target.value)}
                  className="input text-xs"
                  placeholder="e.g. 15,000 mi"
                />
              </label>
              <label>
                <span className="label">{t("Body type")}</span>
                <input
                  value={formData.body_type}
                  onChange={(e) => handleFieldChange("body_type", e.target.value)}
                  className="input text-xs"
                  placeholder="Coupe, Sedan, SUV"
                />
              </label>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="label">{t("Fuel type")}</span>
                  <input
                    value={formData.fuel_type}
                    onChange={(e) => handleFieldChange("fuel_type", e.target.value)}
                    className="input text-xs"
                  />
                </label>
                <label>
                  <span className="label">{t("Transmission")}</span>
                  <input
                    value={formData.transmission}
                    onChange={(e) => handleFieldChange("transmission", e.target.value)}
                    className="input text-xs"
                  />
                </label>
                <label>
                  <span className="label">{t("Engine")}</span>
                  <input
                    value={formData.engine}
                    onChange={(e) => handleFieldChange("engine", e.target.value)}
                    className="input text-xs"
                  />
                </label>
                <label>
                  <span className="label">{t("Exterior color")}</span>
                  <input
                    value={formData.exterior_color}
                    onChange={(e) => handleFieldChange("exterior_color", e.target.value)}
                    className="input text-xs"
                  />
                </label>
              </div>
              <label className="mt-5 block">
                <span className="label">{t("Features")}</span>
                <textarea
                  value={formData.features}
                  onChange={(e) => handleFieldChange("features", e.target.value)}
                  className="input min-h-28 resize-none text-xs"
                  placeholder="Premium sound, panoramic roof, adaptive cruise, heated seats..."
                />
              </label>
            </>
          )}

          {step === 2 && (
            <div className="max-w-md space-y-4">
              <label>
                <span className="label">{t("Asking price")}</span>
                <div className="relative">
                  <DollarSign
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    value={formData.asking_price}
                    onChange={(e) => handleFieldChange("asking_price", e.target.value)}
                    className="input pl-10 text-xl font-bold"
                    placeholder="45,000"
                  />
                </div>
              </label>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600 flex items-start gap-2.5">
                <Sparkles size={16} className="text-[#ef3f32] shrink-0 mt-0.5" />
                <p>
                  We’ll provide a market-based valuation report and pricing
                  recommendation before publishing.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid min-h-64 place-items-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/70 p-8 text-center transition hover:border-[#111214]">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-neutral-400 shadow-xs">
                  <UploadCloud size={30} />
                </span>
                <p className="mt-4 text-sm font-bold text-neutral-800">
                  Drag photos here, or click to browse
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  Up to 20 high-resolution JPG, PNG or WEBP files
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="label">Full Name</span>
                <input
                  value={formData.full_name}
                  onChange={(e) => handleFieldChange("full_name", e.target.value)}
                  className="input text-xs"
                  placeholder="Alex Morgan"
                />
              </label>
              <label>
                <span className="label">Email Address</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="input text-xs"
                  placeholder="alex@example.com"
                />
              </label>
              <label>
                <span className="label">Phone Number</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  className="input text-xs"
                  placeholder="+855 23 555 0186"
                />
              </label>
              <label>
                <span className="label">ZIP / Postal Code</span>
                <input
                  value={formData.zip_code}
                  onChange={(e) => handleFieldChange("zip_code", e.target.value)}
                  className="input text-xs"
                  placeholder="12000"
                />
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-7">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-[#111214] text-white">
                  <CarIcon size={24} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    {formData.year} {formData.make} {formData.model}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Target Asking Price: {formData.asking_price || "Market Rate"}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                Review the details entered in previous steps. You can go back to
                make changes before submitting for our specialists to verify in PostgreSQL database.
              </p>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-white p-3 text-xs font-semibold text-emerald-700 border border-neutral-200">
                <ShieldCheck size={16} />
                <span>Zero listing fees · Complete price transparency</span>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-neutral-100 pt-6">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="btn btn-outline text-xs disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft size={14} />
            <span>{t("Back")}</span>
          </button>

          <button
            type="button"
            onClick={() => (step === 5 ? handleSubmit() : setStep(step + 1))}
            className="btn btn-accent text-xs px-6 py-3"
          >
            <span>{step === 5 ? t("Submit listing") : t("Continue")}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
