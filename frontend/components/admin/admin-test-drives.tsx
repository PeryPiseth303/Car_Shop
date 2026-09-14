"use client";

import React, { useState } from "react";
import { Clock, Calendar, Mail, Phone, Trash2, CheckCircle2 } from "lucide-react";
import { TestDriveItem } from "@/lib/api";

interface AdminTestDrivesProps {
  testDrives: TestDriveItem[];
  onUpdateStatus: (id: number, status: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function AdminTestDrives({
  testDrives,
  onUpdateStatus,
  onDelete,
}: AdminTestDrivesProps) {
  const [filter, setFilter] = useState("All");

  const filtered = testDrives.filter((t) => {
    if (filter === "All") return true;
    return t.status === filter;
  });

  return (
    <div className="card overflow-hidden shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-50/80 p-4">
        <div>
          <h2 className="font-bold text-neutral-900">
            VIP Test Drive Bookings ({testDrives.length})
          </h2>
          <p className="text-xs text-neutral-400">
            Scheduled appointments for private vehicle viewings and road tests
          </p>
        </div>

        <div className="flex gap-2">
          {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map((st) => (
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
        {filtered.map((td) => (
          <div key={td.id} className="p-5 transition hover:bg-neutral-50/50">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900">{td.car_name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      td.status === "Confirmed"
                        ? "bg-emerald-100 text-emerald-700"
                        : td.status === "Pending"
                        ? "bg-amber-100 text-amber-700"
                        : td.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {td.status}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                  <span className="flex items-center gap-1 font-semibold text-neutral-800">
                    <Calendar size={13} className="text-[#ef3f32]" />
                    {td.appointment_date}
                  </span>
                  <span className="flex items-center gap-1 text-neutral-600">
                    <Clock size={13} />
                    {td.time_slot}
                  </span>
                  {td.specialist && (
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px]">
                      Specialist: {td.specialist}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-500">
                  <span className="font-bold text-neutral-800">Client: {td.customer_name}</span>
                  <a
                    href={`mailto:${td.customer_email}`}
                    className="flex items-center gap-1 hover:text-[#ef3f32] font-semibold"
                  >
                    <Mail size={13} />
                    <span>{td.customer_email}</span>
                  </a>
                  {td.customer_phone && (
                    <a
                      href={`tel:${td.customer_phone}`}
                      className="flex items-center gap-1 hover:text-[#ef3f32] font-semibold"
                    >
                      <Phone size={13} />
                      <span>{td.customer_phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Status Update & Actions */}
              <div className="flex items-center gap-2">
                <select
                  value={td.status}
                  onChange={(e) => onUpdateStatus(td.id, e.target.value)}
                  className="input text-xs w-auto cursor-pointer"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={() => onDelete(td.id)}
                  className="grid size-8 place-items-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                  title="Delete Appointment"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-10 text-center text-xs text-neutral-400">
            No test drive appointments found.
          </div>
        )}
      </div>
    </div>
  );
}
