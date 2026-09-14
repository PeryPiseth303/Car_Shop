"use client";

import { ArrowLeftRight } from "lucide-react";
import { useLocalCars } from "@/hooks/use-local-cars";

interface CompareButtonProps {
  id: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CompareButton({ id, className = "", size = "md" }: CompareButtonProps) {
  const { ids, toggle } = useLocalCars("compare");
  const active = ids.includes(id);

  const sizeClasses = {
    sm: "size-8",
    md: "size-9.5",
    lg: "size-11",
  }[size];

  const iconSizes = {
    sm: 13,
    md: 16,
    lg: 19,
  }[size];

  return (
    <button
      type="button"
      aria-label={active ? "Remove from comparison" : "Add to comparison"}
      title={active ? "Remove from comparison" : "Add to comparison"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!active && ids.length >= 4) {
          alert("You can compare up to 4 vehicles at a time.");
          return;
        }
        toggle(id);
      }}
      className={`grid ${sizeClasses} place-items-center rounded-full border border-black/10 backdrop-blur-md shadow-xs transition-all duration-200 hover:scale-110 active:scale-95 ${
        active
          ? "bg-[#111214] text-white border-[#111214] shadow-md"
          : "bg-white/90 text-neutral-700 hover:bg-white hover:text-black"
      } ${className}`}
    >
      <ArrowLeftRight
        size={iconSizes}
        className={`transition-transform duration-200 ${
          active ? "text-white" : "stroke-[1.8]"
        }`}
      />
    </button>
  );
}
