"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Car,
  DollarSign,
  MessageSquare,
  Calendar,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Download,
  Zap,
  Star,
  Layers,
  BarChart3,
  ArrowRight,
  ArrowUpRight,
  Check,
  Phone,
  Mail,
  User,
  SlidersHorizontal,
  Flame,
  Award,
} from "lucide-react";
import { DashboardStats, InquiryItem, SellRequestItem, TestDriveItem } from "@/lib/api";
import { Car as CarType } from "@/types/car";
import { money, number } from "@/lib/utils";

interface AdminOverviewProps {
  analytics: DashboardStats | null;
  cars: CarType[];
  inquiries: InquiryItem[];
  sellRequests: SellRequestItem[];
  testDrives: TestDriveItem[];
  setActiveTab: (tab: any) => void;
  onUpdateInquiryStatus?: (id: number, status: string) => Promise<void>;
  onUpdateTestDriveStatus?: (id: number, status: string) => Promise<void>;
  onUpdateSellStatus?: (id: number, status: string) => Promise<void>;
  onToggleFeatured?: (id: string) => Promise<void>;
}

export function AdminOverview({
  analytics,
  cars,
  inquiries,
  sellRequests,
  testDrives,
  setActiveTab,
  onUpdateInquiryStatus,
  onUpdateTestDriveStatus,
  onUpdateSellStatus,
  onToggleFeatured,
}: AdminOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>("all");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const triggerActionFeedback = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // --- CORE DATA ANALYTICS COMPUTATIONS ---
  const pendingInquiries = inquiries.filter((i) => i.status === "Pending").length;
  const contactedInquiries = inquiries.filter((i) => i.status === "Contacted").length;
  const resolvedInquiries = inquiries.filter((i) => i.status === "Resolved").length;

  const pendingSells = sellRequests.filter((s) => s.status === "Under Review").length;
  const approvedSells = sellRequests.filter((s) => s.status === "Approved" || s.status === "Listed").length;

  const upcomingDrives = testDrives.filter((t) => t.status === "Confirmed").length;
  const completedDrives = testDrives.filter((t) => t.status === "Completed").length;

  const totalValue = useMemo(() => cars.reduce((acc, c) => acc + (c.price || 0), 0), [cars]);
  const avgPrice = cars.length > 0 ? Math.round(totalValue / cars.length) : 0;
  const avgMileage = cars.length > 0 ? Math.round(cars.reduce((acc, c) => acc + (c.mileage || 0), 0) / cars.length) : 0;

  // Condition Breakdown
  const newCount = cars.filter((c) => c.condition === "New").length;
  const certifiedCount = cars.filter((c) => c.condition === "Certified").length;
  const usedCount = cars.filter((c) => c.condition === "Used").length;

  // Powertrain Breakdown
  const evCount = cars.filter((c) => c.fuel_type?.toLowerCase().includes("electric")).length;
  const hybridCount = cars.filter((c) => c.fuel_type?.toLowerCase().includes("hybrid")).length;
  const gasCount = cars.length - evCount - hybridCount;

  // Brand Distribution Analytics
  const brandAnalytics = useMemo(() => {
    const map = new Map<string, { count: number; totalVal: number }>();
    cars.forEach((c) => {
      const b = c.brand || "Other";
      const existing = map.get(b) || { count: 0, totalVal: 0 };
      map.set(b, { count: existing.count + 1, totalVal: existing.totalVal + (c.price || 0) });
    });
    return Array.from(map.entries())
      .map(([brand, data]) => ({
        brand,
        count: data.count,
        totalVal: data.totalVal,
        percentage: Math.round((data.count / (cars.length || 1)) * 100),
      }))
      .sort((a, b) => b.totalVal - a.totalVal);
  }, [cars]);

  // Price Bracket Segmentation Analytics
  const priceBrackets = useMemo(() => {
    const ultra = cars.filter((c) => c.price >= 150000);
    const premium = cars.filter((c) => c.price >= 100000 && c.price < 150000);
    const sport = cars.filter((c) => c.price >= 60000 && c.price < 100000);
    const entry = cars.filter((c) => c.price < 60000);

    return [
      { label: "Ultra Luxury ($150k+)", count: ultra.length, val: ultra.reduce((s, c) => s + c.price, 0), color: "bg-[#ef3f32]" },
      { label: "High Performance ($100k - $150k)", count: premium.length, val: premium.reduce((s, c) => s + c.price, 0), color: "bg-amber-500" },
      { label: "Executive Sport ($60k - $100k)", count: sport.length, val: sport.reduce((s, c) => s + c.price, 0), color: "bg-emerald-500" },
      { label: "Heritage / Entry (< $60k)", count: entry.length, val: entry.reduce((s, c) => s + c.price, 0), color: "bg-blue-500" },
    ];
  }, [cars]);

  // Lead Conversion Funnel
  const inquiryResponseRate = inquiries.length > 0 ? Math.round(((contactedInquiries + resolvedInquiries) / inquiries.length) * 100) : 100;
  const driveConfirmRate = testDrives.length > 0 ? Math.round(((upcomingDrives + completedDrives) / testDrives.length) * 100) : 100;

  // CSV Export Utility
  const handleExportCSV = () => {
    if (cars.length === 0) return;
    const headers = ["ID", "Brand", "Model", "Year", "Price", "Mileage", "Fuel Type", "Transmission", "Condition", "Featured"];
    const rows = cars.map((c) => [
      c.id,
      `"${c.brand}"`,
      `"${c.model}"`,
      c.year,
      c.price,
      c.mileage,
      `"${c.fuel_type || ""}"`,
      `"${c.transmission || ""}"`,
      `"${c.condition}"`,
      c.featured ? "Yes" : "No",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aurelia_motors_fleet_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerActionFeedback("Inventory analytical report exported to CSV.");
  };

  // Filtered lists based on quick search
  const filteredCars = useMemo(() => {
    if (!searchQuery.trim()) return cars.slice(0, 6);
    const q = searchQuery.toLowerCase();
    return cars.filter((c) => `${c.brand} ${c.model} ${c.year} ${c.color}`.toLowerCase().includes(q)).slice(0, 8);
  }, [cars, searchQuery]);

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Toast Feedback */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-neutral-900 border border-emerald-500/40 text-emerald-400 px-4 py-3 text-xs font-bold shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={15} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top Luxury Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#111214] text-white p-7 md:p-8 shadow-xl border border-neutral-800">
        <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-radial from-[#ef3f32]/20 via-transparent to-transparent blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 -bottom-24 size-80 rounded-full bg-radial from-amber-500/10 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-mono font-bold tracking-widest text-neutral-300 backdrop-blur-md uppercase border border-white/10">
                <Sparkles size={11} className="text-[#ef3f32]" />
                <span>Dealership Executive Intelligence</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>PostgreSQL 14+ Synced</span>
              </span>
            </div>

            <h1 className="serif mt-3 text-2xl sm:text-3xl lg:text-3.5xl font-normal tracking-tight text-white">
              Aurelia Motors Dealership Analytics
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Real-time intelligence across <span className="font-semibold text-white">{cars.length} vehicles</span>,
              {" "}<span className="font-semibold text-emerald-400">{money(totalValue)}</span> active fleet valuation,
              customer leads, VIP appointments, and acquisition appraisals.
            </p>
          </div>

          {/* Quick Actions Header */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 px-3.5 py-2.5 text-xs font-bold text-white transition active:scale-95 shadow-sm"
              title="Download fleet spreadsheet"
            >
              <Download size={14} className="text-neutral-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setActiveTab("cars")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#ef3f32] hover:bg-[#d63226] text-white px-4 py-2.5 text-xs font-bold transition active:scale-95 shadow-lg shadow-[#ef3f32]/25"
            >
              <Car size={15} />
              <span>+ Add Vehicle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Universal Quick Search Bar for Friendly Use */}
      <div className="card p-3 shadow-xs border border-neutral-200/90 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Live search inventory by brand, model, color, or year..."
            className="w-full rounded-xl bg-neutral-50 py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef3f32]/20 border border-neutral-200/80 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-neutral-700"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-neutral-400 hidden sm:inline">Quick Jump:</span>
          <button
            onClick={() => setActiveTab("cars")}
            className="rounded-lg bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 text-neutral-700 transition"
          >
            Fleet ({cars.length})
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`rounded-lg px-3 py-1.5 transition ${
              pendingInquiries > 0 ? "bg-blue-100 text-blue-800 font-extrabold" : "bg-neutral-100 text-neutral-700"
            }`}
          >
            Inquiries ({pendingInquiries})
          </button>
          <button
            onClick={() => setActiveTab("test_drives")}
            className="rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 transition"
          >
            Drives ({upcomingDrives})
          </button>
          <button
            onClick={() => setActiveTab("sell_requests")}
            className={`rounded-lg px-3 py-1.5 transition ${
              pendingSells > 0 ? "bg-amber-100 text-amber-800 font-extrabold" : "bg-neutral-100 text-neutral-700"
            }`}
          >
            Appraisals ({pendingSells})
          </button>
        </div>
      </div>

      {/* 6 Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* KPI 1: Inventory Valuation */}
        <div className="card p-5 shadow-xs border border-neutral-200/80 bg-white hover:border-neutral-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Fleet Valuation</span>
            <div className="grid size-8.5 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="mt-3 text-xl font-black text-neutral-900">{money(totalValue)}</p>
          <p className="mt-1 text-[11px] font-medium text-emerald-700 flex items-center gap-1">
            <span>Avg: {money(avgPrice)}</span>
          </p>
        </div>

        {/* KPI 2: Total Inventory */}
        <div
          onClick={() => setActiveTab("cars")}
          className="card p-5 shadow-xs border border-neutral-200/80 bg-white hover:border-neutral-400 hover:shadow-sm cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Showroom Fleet</span>
            <div className="grid size-8.5 place-items-center rounded-xl bg-neutral-100 text-neutral-900">
              <Car size={16} />
            </div>
          </div>
          <p className="mt-3 text-xl font-black text-neutral-900">{cars.length} Cars</p>
          <p className="mt-1 text-[11px] font-medium text-neutral-500">
            {newCount} New · {certifiedCount} Certified
          </p>
        </div>

        {/* KPI 3: Pending Inquiries */}
        <div
          onClick={() => setActiveTab("inquiries")}
          className="card p-5 shadow-xs border border-neutral-200/80 bg-white hover:border-neutral-400 hover:shadow-sm cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Client Inquiries</span>
            <div className="grid size-8.5 place-items-center rounded-xl bg-blue-50 text-blue-700">
              <MessageSquare size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-xl font-black text-neutral-900">{pendingInquiries}</p>
            <span className="text-[10px] font-bold text-amber-600 uppercase">Pending</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-neutral-500">
            {inquiries.length} Total communications
          </p>
        </div>

        {/* KPI 4: Test Drives */}
        <div
          onClick={() => setActiveTab("test_drives")}
          className="card p-5 shadow-xs border border-neutral-200/80 bg-white hover:border-neutral-400 hover:shadow-sm cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">VIP Test Drives</span>
            <div className="grid size-8.5 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Calendar size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-xl font-black text-neutral-900">{upcomingDrives}</p>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Confirmed</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-neutral-500">
            {testDrives.length} Total bookings
          </p>
        </div>

        {/* KPI 5: Trade-In Appraisals */}
        <div
          onClick={() => setActiveTab("sell_requests")}
          className="card p-5 shadow-xs border border-neutral-200/80 bg-white hover:border-neutral-400 hover:shadow-sm cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Appraisals</span>
            <div className="grid size-8.5 place-items-center rounded-xl bg-amber-50 text-amber-700">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-xl font-black text-neutral-900">{pendingSells}</p>
            <span className="text-[10px] font-bold text-amber-700 uppercase">Under Review</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-neutral-500">
            {sellRequests.length} Submissions
          </p>
        </div>

        {/* KPI 6: Average Fleet Mileage */}
        <div className="card p-5 shadow-xs border border-neutral-200/80 bg-white hover:border-neutral-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Avg Mileage</span>
            <div className="grid size-8.5 place-items-center rounded-xl bg-purple-50 text-purple-700">
              <Award size={16} />
            </div>
          </div>
          <p className="mt-3 text-xl font-black text-neutral-900">{number(avgMileage)} mi</p>
          <p className="mt-1 text-[11px] font-medium text-purple-700">
            Pristine condition rating
          </p>
        </div>
      </div>

      {/* DATA ANALYSIS SECTION 1: Brand Market Share & Price Segmentation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Brand Valuation & Share Analysis */}
        <div className="card p-6 shadow-xs border border-neutral-200/80 bg-white lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={17} className="text-[#ef3f32]" />
                <h2 className="font-bold text-neutral-900">Brand Capital Allocation & Fleet Share</h2>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Valuation and volume distribution across luxury automotive manufacturers
              </p>
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">
              {brandAnalytics.length} Brands Active
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brandAnalytics.map((b) => (
              <div
                key={b.brand}
                className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 transition hover:bg-neutral-50 hover:border-neutral-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-neutral-900">{b.brand}</span>
                  <span className="text-xs font-black text-emerald-700">{money(b.totalVal)}</span>
                </div>

                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-[#111214] transition-all duration-500"
                    style={{ width: `${Math.max(b.percentage, 8)}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                  <span>{b.count} {b.count === 1 ? "Vehicle" : "Vehicles"}</span>
                  <span>{b.percentage}% of Fleet</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Bracket Analytics */}
        <div className="card p-6 shadow-xs border border-neutral-200/80 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
              <Layers size={17} className="text-[#ef3f32]" />
              <div>
                <h2 className="font-bold text-neutral-900">Price Tier Segmentation</h2>
                <p className="text-xs text-neutral-400">Inventory spread by luxury price bracket</p>
              </div>
            </div>

            {/* Segment Bar Visualization */}
            <div className="mt-5 flex h-3.5 w-full overflow-hidden rounded-full gap-1 p-0.5 bg-neutral-100">
              {priceBrackets.map((p, i) => (
                <div
                  key={i}
                  className={`h-full rounded-sm ${p.color} transition-all duration-500`}
                  style={{ width: `${Math.max((p.count / (cars.length || 1)) * 100, 5)}%` }}
                  title={`${p.label}: ${p.count} cars`}
                />
              ))}
            </div>

            {/* Price Bracket Details List */}
            <div className="mt-5 space-y-3">
              {priceBrackets.map((pb, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border border-neutral-100 p-2.5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`size-3 rounded-full ${pb.color}`} />
                    <span className="font-bold text-neutral-800">{pb.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-neutral-900">{pb.count} units</span>
                    <span className="ml-1 text-[10px] text-neutral-400">({money(pb.val)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Powertrain Distribution Pill */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Powertrain Mix
            </p>
            <div className="flex items-center gap-2">
              <span className="flex-1 rounded-xl bg-neutral-100 px-3 py-2 text-center text-xs font-bold text-neutral-800">
                ⛽ {gasCount} Gas
              </span>
              <span className="flex-1 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-center text-xs font-bold text-emerald-800">
                ⚡ {evCount} EV
              </span>
              <span className="flex-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-2 text-center text-xs font-bold text-blue-800">
                🔋 {hybridCount} Hybrid
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DATA ANALYSIS SECTION 2: Conversion Funnels & Dealership Operational Velocity */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Funnel 1: Inquiries Response Rate */}
        <div className="card p-5 shadow-xs border border-neutral-200/80 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700">Lead Follow-Up Rate</span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              {inquiryResponseRate}%
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${inquiryResponseRate}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">
            {contactedInquiries + resolvedInquiries} of {inquiries.length} customer messages processed
          </p>
        </div>

        {/* Funnel 2: Test Drive Confirmation */}
        <div className="card p-5 shadow-xs border border-neutral-200/80 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700">VIP Drive Readiness</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              {driveConfirmRate}%
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${driveConfirmRate}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">
            {upcomingDrives} confirmed VIP drive appointments scheduled
          </p>
        </div>

        {/* Funnel 3: Appraisal Intake Velocity */}
        <div className="card p-5 shadow-xs border border-neutral-200/80 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700">Appraisal Review Backlog</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              pendingSells > 0 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
            }`}>
              {pendingSells} Pending
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${sellRequests.length > 0 ? Math.round((approvedSells / sellRequests.length) * 100) : 100}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">
            {approvedSells} reviewed & listed into showroom inventory
          </p>
        </div>
      </div>

      {/* LIVE WORKFLOW TILES (1-Click Friendly Actions) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tile 1: Actionable Inquiries */}
        <div className="card p-6 shadow-xs border border-neutral-200/80 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare size={17} className="text-blue-600" />
                <h3 className="text-base font-bold text-neutral-900">Actionable Customer Inquiries</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Quickly respond and update client follow-ups</p>
            </div>
            <button
              onClick={() => setActiveTab("inquiries")}
              className="text-xs font-bold text-[#ef3f32] hover:underline"
            >
              View all ({inquiries.length}) &rarr;
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {inquiries.slice(0, 4).map((inq) => (
              <div
                key={inq.id}
                className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 transition hover:bg-neutral-50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="grid size-8 place-items-center rounded-xl bg-neutral-900 text-white text-xs font-bold">
                      {inq.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">{inq.name}</p>
                      <p className="text-[11px] text-neutral-500">{inq.email}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      inq.status === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : inq.status === "Contacted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>

                <div className="mt-2.5 rounded-xl bg-white border border-neutral-200/60 p-2.5 text-xs text-neutral-600">
                  <span className="font-semibold text-neutral-900">
                    {inq.car_name ? `Vehicle: ${inq.car_name}` : inq.subject}
                  </span>
                  <p className="mt-0.5 line-clamp-1 text-neutral-500 text-[11px]">"{inq.message}"</p>
                </div>

                {/* 1-Click Action Buttons */}
                {onUpdateInquiryStatus && (
                  <div className="mt-3 flex items-center gap-2">
                    {inq.status !== "Contacted" && (
                      <button
                        onClick={async () => {
                          await onUpdateInquiryStatus(inq.id, "Contacted");
                          triggerActionFeedback(`Marked inquiry from ${inq.name} as Contacted.`);
                        }}
                        className="rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 text-[10px] font-bold transition"
                      >
                        ✓ Mark Contacted
                      </button>
                    )}
                    {inq.status !== "Resolved" && (
                      <button
                        onClick={async () => {
                          await onUpdateInquiryStatus(inq.id, "Resolved");
                          triggerActionFeedback(`Marked inquiry from ${inq.name} as Resolved.`);
                        }}
                        className="rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 text-[10px] font-bold transition"
                      >
                        ✓ Mark Resolved
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {inquiries.length === 0 && (
              <p className="text-xs text-neutral-400 py-8 text-center">No inquiries currently pending.</p>
            )}
          </div>
        </div>

        {/* Tile 2: VIP Test Drive Schedule */}
        <div className="card p-6 shadow-xs border border-neutral-200/80 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar size={17} className="text-emerald-600" />
                <h3 className="text-base font-bold text-neutral-900">VIP Test Drive Appointments</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Showroom track & specialist test drive bookings</p>
            </div>
            <button
              onClick={() => setActiveTab("test_drives")}
              className="text-xs font-bold text-[#ef3f32] hover:underline"
            >
              View all ({testDrives.length}) &rarr;
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {testDrives.slice(0, 4).map((td) => (
              <div
                key={td.id}
                className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 transition hover:bg-neutral-50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-black text-neutral-900">{td.car_name}</p>
                    <p className="text-[11px] text-neutral-500">Client: {td.customer_name} ({td.customer_phone || td.customer_email})</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      td.status === "Confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : td.status === "Completed"
                        ? "bg-neutral-200 text-neutral-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {td.status}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-3 text-xs text-neutral-600">
                  <span className="flex items-center gap-1 font-semibold text-neutral-800">
                    <Clock size={12} className="text-[#ef3f32]" />
                    {td.appointment_date} · {td.time_slot}
                  </span>
                  <span className="text-neutral-400">|</span>
                  <span className="text-[11px] text-neutral-500">Specialist: {td.specialist}</span>
                </div>

                {/* 1-Click Action Buttons */}
                {onUpdateTestDriveStatus && (
                  <div className="mt-3 flex items-center gap-2">
                    {td.status !== "Confirmed" && (
                      <button
                        onClick={async () => {
                          await onUpdateTestDriveStatus(td.id, "Confirmed");
                          triggerActionFeedback(`Confirmed appointment for ${td.customer_name}.`);
                        }}
                        className="rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 text-[10px] font-bold transition"
                      >
                        ✓ Confirm Slot
                      </button>
                    )}
                    {td.status !== "Completed" && (
                      <button
                        onClick={async () => {
                          await onUpdateTestDriveStatus(td.id, "Completed");
                          triggerActionFeedback(`Marked drive for ${td.customer_name} as Completed.`);
                        }}
                        className="rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-2.5 py-1 text-[10px] font-bold transition"
                      >
                        ✓ Mark Completed
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {testDrives.length === 0 && (
              <p className="text-xs text-neutral-400 py-8 text-center">No upcoming test drives booked.</p>
            )}
          </div>
        </div>
      </div>

      {/* QUICK SHOWROOM SHOWCASE SPOTLIGHT (Friendly Featured Vehicle Manager) */}
      <div className="card p-6 shadow-xs border border-neutral-200/80 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Star size={17} className="text-amber-500 fill-amber-500" />
              <h3 className="text-base font-bold text-neutral-900">Showroom Fleet & Live Showcase</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              1-click featured showcase control for homepage live exhibition
            </p>
          </div>
          <button
            onClick={() => setActiveTab("cars")}
            className="btn btn-light py-2 px-3.5 text-xs font-bold border border-neutral-200 flex items-center gap-1.5"
          >
            <span>Manage All {cars.length} Vehicles</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="group rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-3.5 transition hover:bg-white hover:border-neutral-300 hover:shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-200">
                  <Image
                    src={car.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-md bg-[#111214]/85 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                      {car.condition}
                    </span>
                  </div>
                  {car.featured && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="rounded-md bg-amber-500 text-white px-2 py-0.5 text-[10px] font-bold uppercase shadow-xs">
                        ★ Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-xs font-black text-neutral-900">
                    {car.year} {car.brand} {car.model}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {number(car.mileage)} mi · {car.fuel_type || "Gasoline"} · {car.body_type || "Coupe"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="text-sm font-black text-neutral-900">{money(car.price)}</span>

                {onToggleFeatured && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onToggleFeatured(car.id);
                      triggerActionFeedback(`Toggled featured status for ${car.brand} ${car.model}.`);
                    }}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                      car.featured
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        : "bg-neutral-200/80 text-neutral-700 hover:bg-neutral-300"
                    }`}
                  >
                    <Star size={11} className={car.featured ? "fill-amber-600 text-amber-600" : ""} />
                    <span>{car.featured ? "Featured" : "Set Featured"}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
