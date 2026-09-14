"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useLocalCars } from "@/hooks/use-local-cars";

interface FavoriteButtonProps {
  id: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  icon?: "cart" | "heart";
}

export function FavoriteButton({
  id,
  className = "",
  size = "md",
  icon = "cart",
}: FavoriteButtonProps) {
  const { ids, toggle } = useLocalCars("cart");
  const active = ids.includes(id);

  const sizeClasses = {
    sm: "size-8",
    md: "size-9.5",
    lg: "size-11",
  }[size];

  const iconSizes = {
    sm: 14,
    md: 17,
    lg: 20,
  }[size];

  const IconComponent = icon === "heart" ? Heart : ShoppingCart;

  return (
    <button
      type="button"
      title={active ? "Remove from cart" : "Save to cart"}
      aria-label={active ? "Remove from cart" : "Save to cart"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={`grid ${sizeClasses} place-items-center rounded-full border border-black/10 bg-white/90 text-neutral-700 backdrop-blur-md shadow-xs transition-all duration-200 hover:scale-110 hover:bg-white hover:text-[#ef3f32] active:scale-95 ${
        active ? "bg-white text-[#ef3f32] shadow-sm" : ""
      } ${className}`}
    >
      <IconComponent
        size={iconSizes}
        className={`transition-colors duration-200 ${
          active
            ? icon === "heart"
              ? "fill-[#ef3f32] text-[#ef3f32]"
              : "text-[#ef3f32]"
            : "stroke-[1.8]"
        }`}
      />
    </button>
  );
}
