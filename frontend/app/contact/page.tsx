import { Camera, Clock, Mail, MapPin, Phone, ThumbsUp, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata = {
  title: "Contact Us — Aurelia Motors",
  description:
    "Whether you’re searching, selling, or simply curious, our team is ready with a thoughtful answer.",
};

export default function ContactPage() {
  const details = [
    {
      Icon: MapPin,
      title: "Visit us",
      description: "Norodom Boulevard, Phnom Penh, Cambodia",
    },
    {
      Icon: Phone,
      title: "Call",
      description: "+855 23 555 0186",
    },
    {
      Icon: Mail,
      title: "Email",
      description: "hello@aureliamotors.com",
    },
    {
      Icon: Clock,
      title: "Hours",
      description: "Mon–Sat 9am–7pm · Sun 10am–5pm",
    },
  ] as const;

  return (
    <div className="container section">
      {/* Header */}
      <div className="mb-14 max-w-2xl">
        <div className="inline-flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[#ef3f32]" />
          <p className="eyebrow">Talk to a specialist</p>
        </div>
        <h1 className="serif mt-3 text-4xl font-normal tracking-tight text-[#111214] md:text-5xl lg:text-6xl">
          We’re here to help.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-500">
          Whether you’re searching, selling, or simply curious, our team is ready with a
          thoughtful answer and personal guidance.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        {/* Left Column: Contact info & Map */}
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {details.map(({ Icon, title, description }) => (
              <div
                className="flex items-start gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition hover:border-neutral-300"
                key={title}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#fff0ee] text-[#ef3f32]">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {title}
                  </p>
                  <p className="mt-1 text-sm font-bold text-neutral-900">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Channels */}
          <div className="flex items-center gap-3">
            <p className="text-xs font-bold text-neutral-400">Connect:</p>
            {[
              { Icon: Camera, label: "Instagram" },
              { Icon: ThumbsUp, label: "Facebook" },
              { Icon: MessageCircle, label: "Telegram" },
            ].map(({ Icon, label }, index) => (
              <a
                key={index}
                href="#"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-xs transition hover:border-[#ef3f32] hover:bg-[#ef3f32] hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          {/* Interactive Map */}
          <div className="h-64 overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-100 shadow-xs">
            <iframe
              title="Aurelia Motors in Phnom Penh, Cambodia"
              src="https://www.google.com/maps?q=Norodom+Boulevard,+Phnom+Penh,+Cambodia&output=embed"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}
