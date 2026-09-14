"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  Calendar,
  DollarSign,
  Users,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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
  isCollapsed = false,
  onToggleCollapse,
  counts = {},
}: AdminSidebarProps) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // For mobile

  const mainTabs = [
    { id: "overview" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "cars" as const, label: "Vehicles / Fleet", icon: Car },
    { id: "inquiries" as const, label: "Inquiries", icon: MessageSquare, badge: counts.inquiries, badgeColor: "bg-orange-100 text-orange-700" },
    { id: "test_drives" as const, label: "Test Drives", icon: Calendar, badge: counts.testDrives, badgeColor: "bg-blue-100 text-blue-700" },
    { id: "sell_requests" as const, label: "Appraisals", icon: DollarSign, badge: counts.sellRequests, badgeColor: "bg-emerald-100 text-emerald-700" },
  ];

  const managementTabs = [
    { id: "users" as const, label: "Customers", icon: Users },
    { id: "cars" as const, label: "Featured Vehicles", icon: Star },
    { id: "overview" as const, label: "Reports / Analytics", icon: BarChart3 },
  ];

  const renderTab = (tab: any, isActiveOverride?: boolean) => {
    const Icon = tab.icon;
    const isActive = isActiveOverride !== undefined ? isActiveOverride : activeTab === tab.id;
    return (
      <button
        key={`${tab.id}-${tab.label}`}
        type="button"
        title={isCollapsed ? tab.label : undefined}
        onClick={() => {
          setActiveTab(tab.id);
          setIsOpen(false);
        }}
        className={`flex w-full items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} rounded-xl py-2.5 text-[14px] font-semibold transition-all duration-300 ${
          isActive
            ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/10"
            : "text-neutral-500 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:text-white hover:text-neutral-900"
        }`}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full`}>
          <Icon size={18} className={isActive ? "text-emerald-100" : "text-neutral-400"} strokeWidth={isActive ? 2.5 : 2} />
          {!isCollapsed && <span className="tracking-tight">{tab.label}</span>}
        </div>

        {!isCollapsed && tab.badge !== undefined && tab.badge > 0 && (
          <span
            className={`flex items-center justify-center min-w-[20px] h-[20px] rounded-full px-1.5 text-[11px] font-bold ${
              isActive
                ? "bg-emerald-950/50 text-white"
                : tab.badgeColor || "bg-neutral-200 text-neutral-700 dark:text-neutral-300"
            }`}
          >
            {tab.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white dark:bg-[#111318] px-4 py-3 text-sm font-bold border border-neutral-200 dark:border-white/15 shadow-sm text-neutral-700 dark:text-neutral-300"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
          <span>{isOpen ? "Close Menu" : "Admin Menu"}</span>
        </button>
      </div>

      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block shrink-0 bg-white dark:bg-[#111318] border border-neutral-200/80 dark:border-white/10 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] ${isCollapsed ? 'w-[80px] p-3' : 'w-full lg:w-[260px] p-5'} sticky top-[104px] h-[calc(100vh-128px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col transition-all duration-300`}
      >
        {/* Toggle Button for Desktop */}
        {onToggleCollapse && (
          <button 
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-6 size-6 bg-white dark:bg-[#111318] border border-neutral-200 dark:border-white/15 rounded-full items-center justify-center text-neutral-500 dark:text-neutral-500 shadow-sm hover:text-emerald-600 hover:border-emerald-200 z-10 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        <div className="space-y-1 mb-8 mt-2">
          {!isCollapsed && <p className="px-3 text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Main</p>}
          <nav className="space-y-1">{mainTabs.map(t => renderTab(t))}</nav>
        </div>

        <div className="space-y-1 mb-8">
          {!isCollapsed && <p className="px-3 text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Management</p>}
          <nav className="space-y-1">
            {managementTabs.map(t => renderTab(t, activeTab === t.id && t.label.includes(activeTab === 'users' ? 'Customers' : '')))}
          </nav>
        </div>

        <div className={`space-y-1 mt-auto pt-8 border-t border-neutral-100 dark:border-white/5 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {!isCollapsed && <p className="px-3 text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">System</p>}
          <nav className="space-y-1 w-full">
            <button
              type="button"
              title={isCollapsed ? "Settings" : undefined}
              onClick={() => setIsOpen(false)}
              className={`flex w-full items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'} rounded-xl py-2.5 text-[14px] font-semibold text-neutral-500 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:text-white hover:text-neutral-900 transition-all`}
            >
              <Settings size={18} className="text-neutral-400" strokeWidth={2} />
              {!isCollapsed && <span className="tracking-tight">Settings</span>}
            </button>
            <button
              type="button"
              title={isCollapsed ? "Logout" : undefined}
              onClick={logout}
              className={`flex w-full items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'} rounded-xl py-2.5 text-[14px] font-semibold text-red-600 hover:bg-red-50 transition-all`}
            >
              <LogOut size={18} className="text-red-500" strokeWidth={2} />
              {!isCollapsed && <span className="tracking-tight">Logout</span>}
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
