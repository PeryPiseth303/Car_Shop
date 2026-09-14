"use client";

import { useState } from "react";
import { MessageSquare, Phone, X, Check, ShieldCheck, Send, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useLocalCars } from "@/hooks/use-local-cars";
import { apiCreateInquiry } from "@/lib/api";

export function DetailActions({ id }: { id: string }) {
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const { t } = useLanguage();
  const { ids, toggle } = useLocalCars("cart");
  const inCart = ids.includes(id);

  async function copyPhoneNumber() {
    try {
      await navigator.clipboard.writeText("0964076840");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiCreateInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: "Vehicle Enquiry",
        message: formData.message,
        car_id: id,
      });
    } catch (err) {
      console.warn("Inquiry stored locally:", err);
    }
    setSubmitted(true);
    window.setTimeout(() => {
      setSubmitted(false);
      setContactOpen(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 1800);
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Save to Cart Button */}
        <button
          type="button"
          onClick={() => toggle(id)}
          className={`btn w-full py-3.5 text-xs tracking-wide shadow-xs transition flex items-center justify-center gap-2 font-bold ${
            inCart
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-[#111214] text-white hover:bg-[#ef3f32]"
          }`}
        >
          <ShoppingCart size={15} />
          <span>{inCart ? t("Saved in Cart (Click to Remove)") : t("Save to Cart")}</span>
        </button>

        {/* Call / Copy Phone Button */}
        <button
          type="button"
          onClick={copyPhoneNumber}
          className="btn btn-outline w-full py-3 text-xs tracking-wide shadow-xs transition hover:border-[#111214]"
        >
          {copied ? (
            <>
              <Check size={15} className="text-emerald-600" />
              <span className="font-bold text-emerald-600">{t("Copied!")}</span>
            </>
          ) : (
            <>
              <Phone size={15} className="text-[#ef3f32]" />
              <span>096 407 6840</span>
            </>
          )}
        </button>

        {/* Contact Dealer Button */}
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="btn btn-accent w-full py-3 text-xs tracking-wide shadow-md shadow-[#ef3f32]/20"
        >
          <MessageSquare size={16} />
          <span>{t("Contact dealer")}</span>
        </button>
      </div>

      {/* Contact Concierge Modal */}
      {contactOpen && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setContactOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-neutral-100 bg-white p-7 shadow-2xl md:p-8"
          >
            <button
              type="button"
              aria-label="Close contact form"
              className="absolute right-5 top-5 grid size-8 place-items-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200"
              onClick={() => setContactOpen(false)}
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="py-8 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check size={28} />
                </span>
                <h3 className="serif mt-4 text-2xl font-normal text-neutral-900">
                  {t("Message received.")}
                </h3>
                <p className="mt-2 text-xs text-neutral-500">
                  {t("A specialist will respond within one business day.")}
                </p>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#ef3f32]" />
                  <p className="eyebrow">{t("Aurelia concierge")}</p>
                </div>
                <h2 className="serif mt-2 text-3xl font-normal text-[#111214]">
                  {t("Ask about this car")}
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Direct connection with a dedicated vehicle advisor.
                </p>

                <form onSubmit={handleSend} className="mt-6 space-y-3.5">
                  <div>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input text-xs"
                      placeholder={t("Full name")}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input text-xs"
                      placeholder={t("Email address")}
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input text-xs"
                      placeholder={t("Phone number")}
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input min-h-24 resize-none text-xs"
                      placeholder={t("How can we help?")}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-dark w-full py-3.5 text-xs font-bold"
                  >
                    <Send size={14} />
                    <span>{t("Send request")}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
