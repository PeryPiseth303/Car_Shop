"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gauge, Search, Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface AdminHeaderProps {
  activeTab: string;
  onRefresh: () => void;
  loading: boolean;
  onSearch?: (q: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function AdminHeader({ activeTab, onRefresh, loading, onSearch, isDarkMode, onToggleDarkMode }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/80 border-b dark:border-white/10 border-neutral-200/80 dark:border-white/10">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Brand & Search */}
        <div className="flex items-center gap-8 flex-1">
          <Link href="/admin" className="flex items-center gap-2.5 font-black tracking-tight text-neutral-900 dark:text-white shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-[0_2px_10px_-4px_rgba(4,120,87,0.5)]">
              <Gauge size={16} strokeWidth={2.5} />
            </div>
            <span className="text-xl tracking-tighter">AURELIA<span className="text-emerald-600">.</span></span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:block relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search vehicles, customers, inquiries..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full rounded-full border border-neutral-200/80 dark:border-white/10 bg-neutral-50/50 dark:bg-[#0f1115] py-2 pl-10 pr-4 text-sm font-medium text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Dark Mode Toggle */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="relative size-10 rounded-full border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#111318] text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-neutral-50 dark:hover:bg-white/5 transition flex items-center justify-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>
          )}

          {/* Notifications */}
          <button className="relative p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:text-neutral-900 transition-colors">
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
          </button>

          <div className="h-6 w-px bg-neutral-200 hidden sm:block"></div>

          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 rounded-full p-1 hover:bg-neutral-50 dark:hover:bg-white/5 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-100">
                {user?.full_name?.charAt(0) || "A"}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-bold text-neutral-900 dark:text-white leading-none mb-0.5">{user?.full_name || "Admin"}</p>
                <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-500 uppercase tracking-wider">{user?.role || "Administrator"}</p>
              </div>
              <ChevronDown size={14} className="text-neutral-400 hidden sm:block ml-1" strokeWidth={2.5} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#111318] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50 animate-in slide-in-from-top-2">
                <Link href="/" className="block px-3 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 hover:bg-neutral-50 transition-colors">View Live Site</Link>
                <div className="h-px bg-neutral-100 dark:bg-white/10 my-1 mx-2"></div>
                <button 
                  onClick={logout}
                  className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
