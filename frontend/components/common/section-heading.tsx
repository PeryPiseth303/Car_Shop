import React from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  copy?: string;
  center?: boolean;
  className?: string;
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  center = false,
  className = "",
  dark = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-10 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <div
        className={`inline-flex items-center gap-2 ${center ? "justify-center" : ""}`}
      >
        <span className="size-1.5 rounded-full bg-[#ef3f32]" />
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <h2
        className={`serif mt-3 text-3.5xl font-normal tracking-tight md:text-4.5xl lg:text-5xl ${
          dark ? "text-white" : "text-[#111214]"
        } leading-[1.12]`}
      >
        {title}
      </h2>
      {copy && (
        <p
          className={`mt-4 text-sm leading-relaxed md:text-base ${
            dark ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          {copy}
        </p>
      )}
    </div>
  );
}
