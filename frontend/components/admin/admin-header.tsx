"use client";

import React from "react";
import Link from "next/link";
import { Gauge, ShieldCheck, LogOut, Sparkles, ExternalLink, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface AdminHeaderProps {
  activeTab: string;
  onRefresh: () => void;
  loading: boolean;
}

export function AdminHeader({ activeTab, onRefresh, loading }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-neutral-200/90 bg-white shadow-2xs">
      <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
        {/* Brand & Portal Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 font-black tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-[#111214] text-white shadow-xs">
              <Gauge size={18} />
            </span>
            <span className="text-lg font-black tracking-tighter text-neutral-900">
              AURELIA<span className="text-[#ef3f32]">.</span>
            </span>
          </Link>

          <span className="hidden sm:inline-block text-neutral-300">/</span>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>Admin Management Hub</span>
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
              FastAPI + Postgres
            </span>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition"
          >
            <span>Live Showroom</span>
            <ExternalLink size={12} />
          </Link>

          <div className="h-4 w-px bg-neutral-200 hidden md:block" />

          {/* Admin User Profile Pill */}
          <div className="flex items-center gap-2 rounded-xl bg-neutral-50 border border-neutral-200/80 px-3 py-1.5">
            <div className="grid size-7 place-items-center rounded-lg bg-neutral-900 text-white text-xs font-black">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <p className="text-xs font-bold text-neutral-900">{user?.full_name || "Admin"}</p>
              <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 shadow-2xs transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            title="Sign out of Admin Portal"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
