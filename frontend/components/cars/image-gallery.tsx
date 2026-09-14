"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { X, Expand, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

export function ImageGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [full, setFull] = useState(false);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowLeft") {
        setActive((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActive((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };
    if (full) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [full, images.length]);

  return (
    <>
      <div className="grid gap-3.5 md:grid-cols-[1fr_180px] lg:grid-cols-[1fr_200px]">
        {/* Main Showcase Image */}
        <div className="group relative aspect-[16/10.5] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100 shadow-sm md:rounded-3xl">
          <Image
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-102"
            src={images[active]}
            alt={name}
            sizes="(max-width: 768px) 100vw, 80vw"
          />

          {/* Floating Expand CTA */}
          <button
            type="button"
            onClick={() => setFull(true)}
            aria-label="View fullscreen gallery"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-black/10 bg-white/90 text-neutral-800 backdrop-blur-md shadow-xs transition hover:scale-105 hover:bg-white hover:text-[#ef3f32] active:scale-95"
          >
            <Expand size={17} />
          </button>

          {/* Photo Counter Badge */}
          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            {active + 1} / {images.length}
          </div>
        </div>

        {/* Desktop Vertical Thumbnails */}
        <div className="hidden grid-rows-3 gap-3.5 md:grid">
          {images.map((im, i) => (
            <button
              type="button"
              onClick={() => setActive(i)}
              key={im}
              className={`relative overflow-hidden rounded-xl border bg-neutral-100 transition-all duration-200 ${
                active === i
                  ? "border-[#ef3f32] ring-2 ring-[#ef3f32]/40 shadow-xs"
                  : "border-neutral-200/80 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                fill
                className="object-cover"
                src={im}
                alt={`${name} view ${i + 1}`}
                sizes="200px"
              />
            </button>
          ))}
        </div>

        {/* Mobile Horizontal Thumbnail Slider */}
        <div className="md:hidden">
          <Swiper spaceBetween={10} slidesPerView={3.2}>
            {images.map((im, i) => (
              <SwiperSlide key={im}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-neutral-100 ${
                    active === i
                      ? "border-[#ef3f32] ring-2 ring-[#ef3f32]"
                      : "border-neutral-200"
                  }`}
                >
                  <Image
                    fill
                    className="object-cover"
                    src={im}
                    alt={`${name} thumbnail ${i + 1}`}
                    sizes="120px"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {full && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          onClick={() => setFull(false)}
        >
          {/* Top Bar with Counter and Close */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 text-white">
            <span className="text-sm font-semibold tracking-wider text-neutral-400">
              {name} — {active + 1} of {images.length}
            </span>
            <button
              type="button"
              onClick={() => setFull(false)}
              className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
              aria-label="Close fullscreen view"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActive((prev) => (prev > 0 ? prev - 1 : images.length - 1));
            }}
            className="absolute left-6 grid size-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActive((prev) => (prev < images.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-6 grid size-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Main Fullscreen Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[80vh] w-full max-w-5xl"
          >
            <Image
              fill
              className="object-contain"
              src={images[active]}
              alt={name}
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
