"use client";

import React from "react";
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  DollarSign,
  Calendar,
  Users,
  Sparkles,
} from "lucide-react";

export type AdminTabType =
  | "overview"
  | "cars"
  | "inquiries"
  | "sell_requests"
  | "test_drives"
  | "users";

interface AdminSidebarProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  counts?: {
    cars?: number;
    inquiries?: number;
    sellRequests?: number;
    testDrives?: number;
    users?: number;
  };
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  counts = {},
}: AdminSidebarProps) {
  const tabs = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    {
      id: "cars" as const,
      label: "Inventory Cars",
      icon: Car,
      badge: counts.cars,
    },
    {
      id: "inquiries" as const,
      label: "Customer Inquiries",
      icon: MessageSquare,
      badge: counts.inquiries,
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "sell_requests" as const,
      label: "Sell Submissions",
      icon: DollarSign,
      badge: counts.sellRequests,
      badgeColor: "bg-amber-100 text-amber-700",
    },
    {
      id: "test_drives" as const,
      label: "Test Drives",
      icon: Calendar,
      badge: counts.testDrives,
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      id: "users" as const,
      label: "Users & Security",
      icon: Users,
      badge: counts.users,
    },
  ];

  return (
    <aside className="space-y-4">
      <div className="card p-3 shadow-xs">
        <p className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
          Admin Management
        </p>
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className={isActive ? "text-[#ef3f32]" : "text-neutral-400"}
                  />
                  <span>{tab.label}</span>
                </div>

                {tab.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : tab.badgeColor || "bg-neutral-200/80 text-neutral-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Info Card */}
      <div className="card p-4 shadow-xs bg-neutral-900 text-white">
        <div className="flex items-center gap-2 text-xs font-bold text-[#ef3f32]">
          <Sparkles size={14} />
          <span>Aurelia Security</span>
        </div>
        <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
          Admin role verified. All backend actions are authenticated via JWT token & OTP sessions.
        </p>
      </div>
    </aside>
  );
}
