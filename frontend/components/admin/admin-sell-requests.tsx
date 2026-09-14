"use client";

import React, { useState } from "react";
import { DollarSign, Trash2, Mail, Phone, Tag } from "lucide-react";
import { SellRequestItem } from "@/lib/api";

interface AdminSellRequestsProps {
  sellRequests: SellRequestItem[];
  onUpdateStatus: (id: number, status: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function AdminSellRequests({
  sellRequests,
  onUpdateStatus,
  onDelete,
}: AdminSellRequestsProps) {
  const [filter, setFilter] = useState("All");

  const filtered = sellRequests.filter((s) => {
    if (filter === "All") return true;
    return s.status === filter;
  });

  return (
    <div className="card overflow-hidden shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-50/80 p-4">
        <div>
          <h2 className="font-bold text-neutral-900">
            Customer Sell & Consign Submissions ({sellRequests.length})
          </h2>
          <p className="text-xs text-neutral-400">
            Vehicles submitted for showroom appraisal and listing from the Sell Wizard
          </p>
        </div>

        <div className="flex gap-2">
          {["All", "Under Review", "Approved", "Rejected", "Listed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                filter === st
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        {filtered.map((req) => (
          <div key={req.id} className="p-5 transition hover:bg-neutral-50/50">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900">
                    {req.year || ""} {req.make} {req.model}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      req.status === "Under Review"
                        ? "bg-amber-100 text-amber-700"
                        : req.status === "Approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : req.status === "Listed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-neutral-600">
                  {req.asking_price && (
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                      Asking: {req.asking_price}
                    </span>
                  )}
                  {req.mileage && (
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5">
                      Mileage: {req.mileage}
                    </span>
                  )}
                  {req.transmission && (
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5">
                      {req.transmission}
                    </span>
                  )}
                  {req.exterior_color && (
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5">
                      Color: {req.exterior_color}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-500">
                  <span className="font-bold text-neutral-800">Owner: {req.full_name}</span>
                  <a
                    href={`mailto:${req.email}`}
                    className="flex items-center gap-1 hover:text-[#ef3f32] font-semibold"
                  >
                    <Mail size={13} />
                    <span>{req.email}</span>
                  </a>
                  {req.phone && (
                    <a
                      href={`tel:${req.phone}`}
                      className="flex items-center gap-1 hover:text-[#ef3f32] font-semibold"
                    >
                      <Phone size={13} />
                      <span>{req.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Status Update & Actions */}
              <div className="flex items-center gap-2">
                <select
                  value={req.status}
                  onChange={(e) => onUpdateStatus(req.id, e.target.value)}
                  className="input text-xs w-auto cursor-pointer"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Listed">Listed</option>
                </select>

                <button
                  type="button"
                  onClick={() => onDelete(req.id)}
                  className="grid size-8 place-items-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                  title="Delete Request"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-10 text-center text-xs text-neutral-400">
            No sell submissions found.
          </div>
        )}
      </div>
    </div>
  );
}
