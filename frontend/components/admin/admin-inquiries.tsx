"use client";

import React, { useState } from "react";
import { Mail, Phone, Trash2, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import { InquiryItem } from "@/lib/api";

interface AdminInquiriesProps {
  inquiries: InquiryItem[];
  onUpdateStatus: (id: number, status: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function AdminInquiries({
  inquiries,
  onUpdateStatus,
  onDelete,
}: AdminInquiriesProps) {
  const [filter, setFilter] = useState("All");

  const filtered = inquiries.filter((inq) => {
    if (filter === "All") return true;
    return inq.status === filter;
  });

  return (
    <div className="card overflow-hidden shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-50/80 p-4">
        <div>
          <h2 className="font-bold text-neutral-900">Customer Inquiries ({inquiries.length})</h2>
          <p className="text-xs text-neutral-400">Messages submitted from vehicle details and contact forms</p>
        </div>

        <div className="flex gap-2">
          {["All", "Pending", "Contacted", "Resolved", "Archived"].map((st) => (
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
        {filtered.map((inq) => (
          <div key={inq.id} className="p-5 transition hover:bg-neutral-50/50">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900">{inq.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      inq.status === "Pending"
                        ? "bg-amber-100 text-amber-700"
                        : inq.status === "Contacted"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>

                <p className="mt-1 text-xs font-bold text-[#ef3f32]">
                  {inq.car_name ? `Vehicle: ${inq.car_name}` : `Subject: ${inq.subject}`}
                </p>

                <p className="mt-2 text-xs text-neutral-700 leading-relaxed bg-neutral-100/60 p-3 rounded-xl">
                  "{inq.message}"
                </p>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-500">
                  <a
                    href={`mailto:${inq.email}`}
                    className="flex items-center gap-1 hover:text-[#ef3f32] font-semibold"
                  >
                    <Mail size={13} />
                    <span>{inq.email}</span>
                  </a>
                  {inq.phone && (
                    <a
                      href={`tel:${inq.phone}`}
                      className="flex items-center gap-1 hover:text-[#ef3f32] font-semibold"
                    >
                      <Phone size={13} />
                      <span>{inq.phone}</span>
                    </a>
                  )}
                  <span className="text-neutral-400">
                    Received: {new Date(inq.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status Update & Actions */}
              <div className="flex items-center gap-2">
                <select
                  value={inq.status}
                  onChange={(e) => onUpdateStatus(inq.id, e.target.value)}
                  className="input text-xs w-auto cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Archived">Archived</option>
                </select>

                <button
                  type="button"
                  onClick={() => onDelete(inq.id)}
                  className="grid size-8 place-items-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                  title="Delete Inquiry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-10 text-center text-xs text-neutral-400">
            No inquiries match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
