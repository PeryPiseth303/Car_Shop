"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Car,
  Plus,
  Search,
  Trash2,
  Edit,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { Car as CarType } from "@/types/car";
import { money, number } from "@/lib/utils";

interface AdminCarsProps {
  cars: CarType[];
  onAddCar: (carData: any) => Promise<void>;
  onUpdateCar: (id: string, carData: any) => Promise<void>;
  onDeleteCar: (id: string) => Promise<void>;
  onToggleFeatured: (id: string) => Promise<void>;
}

export function AdminCars({
  cars,
  onAddCar,
  onUpdateCar,
  onDeleteCar,
  onToggleFeatured,
}: AdminCarsProps) {
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);

  // Modal Form State
  const [formData, setFormData] = useState({
    brand: "Porsche",
    model: "",
    body_type: "Coupe",
    price: 100000,
    hp: 400,
    engine: "3.0L Twin-Turbo",
    acceleration_0_100: "3.5s",
    top_speed_kmh: 300,
    fuel_type: "Petrol",
    transmission: "Automatic",
    year: 2024,
    mileage_km: 1200,
    featured: false,
    image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
  });

  const filteredCars = useMemo(() => {
    return cars.filter((c) => {
      const matchQuery =
        `${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase());
      const matchBrand = brandFilter === "All" || c.brand === brandFilter;
      return matchQuery && matchBrand;
    });
  }, [cars, search, brandFilter]);

  const brands = useMemo(() => {
    const list = Array.from(new Set(cars.map((c) => c.brand)));
    return ["All", ...list];
  }, [cars]);

  const openCreateModal = () => {
    setEditingCar(null);
    setFormData({
      brand: "Porsche",
      model: "",
      body_type: "Coupe",
      price: 100000,
      hp: 400,
      engine: "3.0L Twin-Turbo",
      acceleration_0_100: "3.5s",
      top_speed_kmh: 300,
      fuel_type: "Petrol",
      transmission: "Automatic",
      year: 2024,
      mileage_km: 1200,
      featured: false,
      image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
    });
    setModalOpen(true);
  };

  const openEditModal = (car: CarType) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      body_type: car.body_type || car.bodyType || "Coupe",
      price: car.price,
      hp: car.hp || car.horsepower || 400,
      engine: car.engine || "3.0L Turbo",
      acceleration_0_100: car.acceleration_0_100 || "3.5s",
      top_speed_kmh: car.top_speed_kmh || 300,
      fuel_type: car.fuel_type || car.fuelType || "Petrol",
      transmission: car.transmission || "Automatic",
      year: car.year || 2024,
      mileage_km: car.mileage_km || car.mileage || 0,
      featured: car.featured || false,
      image_url: car.image_url || car.images?.[0] || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCar) {
      await onUpdateCar(editingCar.id, formData);
    } else {
      await onAddCar(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="card flex flex-wrap items-center justify-between gap-4 p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search make or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 text-xs"
            />
          </div>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="input text-xs w-auto cursor-pointer"
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b === "All" ? "All Brands" : b}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="btn btn-dark py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Cars Grid / List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="card overflow-hidden shadow-xs hover:border-neutral-300 transition flex flex-col justify-between"
          >
            <div>
              {/* Image Preview */}
              <div className="relative h-44 w-full bg-neutral-100">
                <Image
                  src={car.images?.[0] || car.image_url || "/images/cars/car-1.jpg"}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => onToggleFeatured(car.id)}
                  title={car.featured ? "Unmark featured" : "Mark as featured"}
                  className={`absolute top-3 right-3 grid size-8 place-items-center rounded-xl backdrop-blur-md transition ${
                    car.featured
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-black/40 text-white/70 hover:text-white"
                  }`}
                >
                  <Star size={14} className={car.featured ? "fill-white" : ""} />
                </button>
              </div>

              {/* Details */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ef3f32]">
                    {car.brand}
                  </span>
                  <span className="text-[11px] font-bold text-neutral-400">
                    {car.year || 2024} · {car.body_type || car.bodyType || "Coupe"}
                  </span>
                </div>
                <h3 className="serif mt-1 text-base font-bold text-neutral-900 line-clamp-1">
                  {car.brand} {car.model}
                </h3>
                <p className="mt-2 text-sm font-black text-neutral-900">
                  {money(car.price)}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-500">
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5">
                    {car.hp || car.horsepower || 400} HP
                  </span>
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5">
                    {car.engine || "Turbo"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-neutral-100 p-3 bg-neutral-50/50">
              <Link
                href={`/cars/${car.id}`}
                target="_blank"
                className="text-xs font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
              >
                <span>View</span>
                <ExternalLink size={12} />
              </Link>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(car)}
                  className="grid size-8 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 shadow-2xs"
                  title="Edit Vehicle"
                >
                  <Edit size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteCar(car.id)}
                  className="grid size-8 place-items-center rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50 shadow-2xs"
                  title="Delete Vehicle"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="card p-12 text-center shadow-xs">
          <Car size={32} className="mx-auto text-neutral-300" />
          <h3 className="mt-3 font-bold text-neutral-900">No vehicles match your search</h3>
          <p className="text-xs text-neutral-400 mt-1">Try resetting search filters or add a new vehicle.</p>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="serif text-xl font-bold text-neutral-900">
                {editingCar ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="grid size-8 place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="label">Brand / Make</span>
                  <input
                    className="input text-xs"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </label>
                <label className="block">
                  <span className="label">Model</span>
                  <input
                    className="input text-xs"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <span className="label">Price ($)</span>
                  <input
                    type="number"
                    className="input text-xs"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </label>
                <label className="block">
                  <span className="label">Horsepower</span>
                  <input
                    type="number"
                    className="input text-xs"
                    value={formData.hp}
                    onChange={(e) => setFormData({ ...formData, hp: Number(e.target.value) })}
                    required
                  />
                </label>
                <label className="block">
                  <span className="label">Body Type</span>
                  <select
                    className="input text-xs"
                    value={formData.body_type}
                    onChange={(e) => setFormData({ ...formData, body_type: e.target.value })}
                  >
                    <option value="Coupe">Coupe</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="label">Engine</span>
                <input
                  className="input text-xs"
                  value={formData.engine}
                  onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="label">Image URL (Unsplash or direct link)</span>
                <input
                  className="input text-xs"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                />
              </label>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="size-4 rounded accent-[#ef3f32]"
                />
                <label htmlFor="featured-check" className="font-bold text-neutral-800 cursor-pointer">
                  Feature vehicle on homepage
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-light py-2 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-dark py-2 px-5 text-xs font-bold">
                  {editingCar ? "Save Changes" : "Create Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
