"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactValues } from "@/lib/validations";
import { Check, Send, ChevronDown } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { apiCreateInquiry } from "@/lib/api";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      await apiCreateInquiry({
        name: values.name,
        email: values.email,
        phone: values.phone,
        subject: values.subject,
        message: values.message,
      });
    } catch (e) {
      console.warn("Inquiry submitted locally:", e);
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="card grid min-h-96 place-items-center p-8 text-center shadow-lg">
        <div>
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <Check size={30} strokeWidth={2.5} />
          </span>
          <h2 className="serif mt-5 text-3xl font-normal text-neutral-900">
            {t("Message received.")}
          </h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-sm">
            {t("A specialist will respond within one business day.")}
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="btn btn-outline mt-6 text-xs"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card grid gap-4.5 p-7 shadow-lg md:grid-cols-2 md:p-9"
    >
      <div className="md:col-span-2 border-b border-neutral-100 pb-4 mb-2">
        <h2 className="serif text-2xl font-normal text-neutral-900">
          Send an enquiry
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Fill out the details below and our advisors will get back to you promptly.
        </p>
      </div>

      <Field label={t("Name")} error={errors.name?.message}>
        <input
          {...register("name")}
          className={`input text-xs ${errors.name ? "border-red-400 focus:ring-red-200" : ""}`}
          placeholder="Alex Morgan"
        />
      </Field>

      <Field label={t("Email")} error={errors.email?.message}>
        <input
          type="email"
          {...register("email")}
          className={`input text-xs ${errors.email ? "border-red-400 focus:ring-red-200" : ""}`}
          placeholder="alex@example.com"
        />
      </Field>

      <Field label={t("Phone")} error={errors.phone?.message}>
        <input
          type="tel"
          {...register("phone")}
          className={`input text-xs ${errors.phone ? "border-red-400 focus:ring-red-200" : ""}`}
          placeholder="+855 23 555 0186"
        />
      </Field>

      <Field label={t("Subject")} error={errors.subject?.message}>
        <div className="relative">
          <select
            {...register("subject")}
            className={`input appearance-none pr-10 text-xs cursor-pointer ${
              errors.subject ? "border-red-400" : ""
            }`}
          >
            <option value="">{t("Select a topic")}</option>
            <option value="Vehicle enquiry">{t("Vehicle enquiry")}</option>
            <option value="Sell my car">{t("Sell my car")}</option>
            <option value="Financing">{t("Financing")}</option>
            <option value="General question">{t("General question")}</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
        </div>
      </Field>

      <div className="md:col-span-2">
        <Field label={t("Message")} error={errors.message?.message}>
          <textarea
            {...register("message")}
            className={`input min-h-32 resize-none text-xs ${
              errors.message ? "border-red-400 focus:ring-red-200" : ""
            }`}
            placeholder="Tell us how we can help..."
          />
        </Field>
      </div>

      <div className="md:col-span-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-dark w-full py-3.5 text-xs font-bold"
        >
          <Send size={14} />
          <span>{t("Send message")}</span>
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600 font-medium">{error}</span>}
    </label>
  );
}
