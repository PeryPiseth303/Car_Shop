"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  Car,
  MessageSquare,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  Plus,
  ArrowUpRight,
  Clock,
  Gauge,
  Activity,
  Star,
  Edit2,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertCircle
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
  globalSearchQuery?: string;
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
  globalSearchQuery = "",
}: AdminOverviewProps) {
  
  // Data computation
  const totalValue = cars.reduce((acc, c) => acc + (c.price || 0), 0);
  
  const newCount = cars.filter(c => c.condition === "New").length;
  const certifiedCount = cars.filter(c => c.condition === "Certified").length;
  
  const pendingInquiries = inquiries.filter(i => i.status === "Pending").length;
  const upcomingDrives = testDrives.filter(t => t.status === "Confirmed").length;
  const pendingSells = sellRequests.filter(s => s.status === "Under Review").length;

  const contactedInquiries = inquiries.filter((i) => i.status === "Contacted").length;
  const resolvedInquiries = inquiries.filter((i) => i.status === "Resolved").length;
  const completedDrives = testDrives.filter((t) => t.status === "Completed").length;
  const approvedSells = sellRequests.filter((s) => s.status === "Approved" || s.status === "Listed").length;

  const inquiryResponseRate = inquiries.length > 0 ? Math.round(((contactedInquiries + resolvedInquiries) / inquiries.length) * 100) : 100;
  const driveConfirmRate = testDrives.length > 0 ? Math.round(((upcomingDrives + completedDrives) / testDrives.length) * 100) : 100;
  const appraisalApproval = sellRequests.length > 0 ? Math.round((approvedSells / sellRequests.length) * 100) : 100;

  // Analytics - Brand
  const brandAnalytics = useMemo(() => {
    const map = new Map<string, number>();
    cars.forEach((c) => {
      const b = c.brand || "Other";
      map.set(b, (map.get(b) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([brand, count]) => ({
        brand,
        count,
        percentage: Math.round((count / (cars.length || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count).slice(0, 5);
  }, [cars]);

  // Analytics - Powertrain
  const evCount = cars.filter((c) => c.fuel_type?.toLowerCase().includes("electric")).length;
  const hybridCount = cars.filter((c) => c.fuel_type?.toLowerCase().includes("hybrid")).length;
  const gasCount = cars.length - evCount - hybridCount;
  
  const gasPct = Math.round((gasCount/cars.length)*100) || 0;
  const hybridPct = Math.round((hybridCount/cars.length)*100) || 0;
  const evPct = Math.round((evCount/cars.length)*100) || 0;
  
  // For the conic gradient: Gas (gray) -> Hybrid (blue) -> EV (green)
  const conicGradientStr = `conic-gradient(#52525b 0% ${gasPct}%, #3b82f6 ${gasPct}% ${gasPct + hybridPct}%, #10b981 ${gasPct + hybridPct}% 100%)`;

  const handleExportCSV = () => {
    if (cars.length === 0) return;
    const headers = ["ID", "Brand", "Model", "Year", "Price", "Mileage", "Fuel Type", "Condition"];
    const rows = cars.map((c) => [c.id, `"${c.brand}"`, `"${c.model}"`, c.year, c.price, c.mileage, `"${c.fuel_type}"`, `"${c.condition}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `inventory_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  const filteredInventory = globalSearchQuery 
    ? cars.filter(c => `${c.brand} ${c.model} ${c.year}`.toLowerCase().includes(globalSearchQuery.toLowerCase()))
    : cars.slice(0, 4);

  // Generate Today's Activity Feed
  const recentActivities = useMemo(() => {
    const arr = [
      ...inquiries.map(i => ({ 
        id: `inq-${i.id}`, 
        type: 'inquiry', 
        title: 'New inquiry received', 
        desc: `Customer interested in ${i.car_name || 'a vehicle'}`, 
        timeStr: new Date(i.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        dateObj: new Date(i.created_at) 
      })),
      ...testDrives.map(t => ({ 
        id: `td-${t.id}`, 
        type: 'test_drive', 
        title: `Test drive ${t.status.toLowerCase()}`, 
        desc: t.car_name, 
        timeStr: new Date(t.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        dateObj: new Date(t.appointment_date) 
      }))
    ];
    return arr.sort((a,b) => b.dateObj.getTime() - a.dateObj.getTime()).slice(0, 4);
  }, [inquiries, testDrives]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 w-full">
      
      {/* 1. HERO / WELCOME SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-2 pb-4">
        <div className="space-y-2">
          <h1 className="text-[32px] font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
            Good morning, Admin
          </h1>
          <p className="text-[15px] text-neutral-500 dark:text-neutral-500 font-medium">
            Here's what's happening across your showroom today.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[13px] font-bold text-neutral-400">
            <span className="bg-neutral-100 dark:bg-white/10 px-2 py-0.5 rounded-md text-neutral-600 dark:text-neutral-400">{cars.length} vehicles</span>
            <span>•</span>
            <span className="bg-orange-50 px-2 py-0.5 rounded-md text-orange-600">{pendingInquiries} pending inquiries</span>
            <span>•</span>
            <span className="bg-blue-50 px-2 py-0.5 rounded-md text-blue-600">{upcomingDrives} upcoming drives</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#111318] px-5 py-2.5 text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm active:scale-95"
          >
            <Download size={16} strokeWidth={2.5} className="text-neutral-500 dark:text-neutral-500" />
            Export CSV
          </button>
          <button 
            onClick={() => setActiveTab("cars")}
            className="flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        
        {/* Primary Card: Fleet Valuation */}
        <div className="group rounded-2xl bg-emerald-900 p-5 shadow-\[0_8px_30px_rgb\(4\,120\,87\,0\.15\)\] shadow-[0_8px_30px_rgb(4,120,87,0.15)] dark:shadow-none relative overflow-hidden flex flex-col justify-between border border-emerald-800 text-white min-w-0">
          <div className="absolute -right-6 -top-6 size-32 rounded-full bg-emerald-800/50 pointer-events-none" />
          <div className="relative z-10 min-w-0">
            <div className="flex items-center gap-3 mb-4 opacity-90">
              <DollarSign size={20} strokeWidth={2.5} className="shrink-0" />
              <h3 className="text-[14px] font-semibold truncate">Fleet Valuation</h3>
            </div>
            <p className="text-[28px] xl:text-[32px] font-black tracking-tight truncate" title={money(totalValue).replace(/\.00$/, '')}>
              {money(totalValue).replace(/\.00$/, '')}
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-1 relative z-10">
            <span className="text-[13px] font-medium text-emerald-100/80 truncate">Total inventory value</span>
            <div className="flex items-center text-emerald-300 text-[12px] font-bold mt-1 whitespace-nowrap">
              <TrendingUp size={14} className="mr-1.5 shrink-0" strokeWidth={3}/> 
              <span className="truncate">+2.4% from last month</span>
            </div>
          </div>
        </div>

        {/* Card: Showroom Fleet */}
        <div className="group rounded-2xl bg-white dark:bg-[#111318] p-5 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400 shrink-0">
                <Car size={16} strokeWidth={2.5} />
              </div>
              <h3 className="text-[14px] font-semibold text-neutral-600 dark:text-neutral-400 truncate">Showroom Fleet</h3>
            </div>
            <div className="flex items-baseline gap-1.5 min-w-0">
              <p className="text-[28px] xl:text-[32px] font-black tracking-tight text-neutral-900 dark:text-white truncate">{cars.length}</p>
              <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider truncate">Vehicles</span>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-[12px] font-bold text-neutral-500 dark:text-neutral-500 overflow-hidden">
             <span className="text-neutral-700 dark:text-neutral-300 bg-neutral-100/80 px-2 py-1 rounded-md shrink-0">{newCount} New</span>
             <span className="text-neutral-700 dark:text-neutral-300 bg-neutral-100/80 px-2 py-1 rounded-md shrink-0">{certifiedCount} Certified</span>
          </div>
        </div>

        {/* Card: Inquiries */}
        <div className="group rounded-2xl bg-white dark:bg-[#111318] p-5 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 shrink-0">
                <MessageSquare size={16} strokeWidth={2.5} />
              </div>
              <h3 className="text-[14px] font-semibold text-neutral-600 dark:text-neutral-400 truncate">Client Inquiries</h3>
            </div>
            <div className="flex items-baseline gap-2 min-w-0">
              <p className="text-[28px] xl:text-[32px] font-black tracking-tight text-neutral-900 dark:text-white truncate">{pendingInquiries}</p>
              <span className={`text-[11px] font-bold uppercase tracking-widest truncate shrink-0 ${pendingInquiries > 0 ? 'text-orange-500' : 'text-neutral-400'}`}>Pending</span>
            </div>
          </div>
          <div className="mt-5 flex items-center text-[13px] font-semibold text-neutral-500 dark:text-neutral-500 truncate">
            <span className="truncate">{inquiries.length} Total inquiries</span>
          </div>
        </div>

        {/* Card: VIP Drives */}
        <div className="group rounded-2xl bg-white dark:bg-[#111318] p-5 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <Calendar size={16} strokeWidth={2.5} />
              </div>
              <h3 className="text-[14px] font-semibold text-neutral-600 dark:text-neutral-400 truncate">VIP Test Drives</h3>
            </div>
            <div className="flex items-baseline gap-2 min-w-0">
              <p className="text-[28px] xl:text-[32px] font-black tracking-tight text-neutral-900 dark:text-white truncate">{upcomingDrives}</p>
              <span className={`text-[11px] font-bold uppercase tracking-widest truncate shrink-0 ${upcomingDrives > 0 ? 'text-blue-600' : 'text-neutral-400'}`}>Upcoming</span>
            </div>
          </div>
          <div className="mt-5 flex items-center text-[13px] font-semibold text-neutral-500 dark:text-neutral-500 truncate">
            <span className="truncate">{testDrives.length} Total bookings</span>
          </div>
        </div>

        {/* Card: Appraisals */}
        <div className="group rounded-2xl bg-white dark:bg-[#111318] p-5 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                <TrendingUp size={16} strokeWidth={2.5} />
              </div>
              <h3 className="text-[14px] font-semibold text-neutral-600 dark:text-neutral-400 truncate">Appraisals</h3>
            </div>
            <div className="flex items-baseline gap-2 min-w-0">
              <p className="text-[28px] xl:text-[32px] font-black tracking-tight text-neutral-900 dark:text-white truncate">{pendingSells}</p>
              <span className={`text-[11px] font-bold uppercase tracking-widest truncate shrink-0 ${pendingSells > 0 ? 'text-orange-500' : 'text-neutral-400'}`}>Pending</span>
            </div>
          </div>
          <div className="mt-5 flex items-center text-[13px] font-semibold text-neutral-500 dark:text-neutral-500 truncate">
            <span className="truncate">{sellRequests.length} Total requests</span>
          </div>
        </div>

      </div>

      {/* 3. QUICK ACTIONS (Horizontal Toolbar) */}
      <div className="rounded-2xl bg-white dark:bg-[#111318] p-4 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col sm:flex-row items-center gap-4">
        <h2 className="text-[14px] font-bold text-neutral-400 uppercase tracking-widest px-2 shrink-0 hidden sm:block">Quick Actions</h2>
        <div className="flex-1 flex flex-wrap gap-3 w-full">
          <button onClick={() => setActiveTab("cars")} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 hover:bg-neutral-100 border border-neutral-200/60 text-sm font-bold text-neutral-700 dark:text-neutral-300 transition-all active:scale-95">
            <Plus size={16} className="text-emerald-600" strokeWidth={2.5} /> Add Vehicle
          </button>
          <button onClick={() => setActiveTab("inquiries")} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 hover:bg-neutral-100 border border-neutral-200/60 text-sm font-bold text-neutral-700 dark:text-neutral-300 transition-all active:scale-95">
            <MessageSquare size={16} className="text-orange-500" strokeWidth={2.5} /> View Inquiries
          </button>
          <button onClick={() => setActiveTab("test_drives")} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 hover:bg-neutral-100 border border-neutral-200/60 text-sm font-bold text-neutral-700 dark:text-neutral-300 transition-all active:scale-95">
            <Calendar size={16} className="text-blue-500" strokeWidth={2.5} /> Schedule Drive
          </button>
          <button onClick={() => setActiveTab("sell_requests")} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 hover:bg-neutral-100 border border-neutral-200/60 text-sm font-bold text-neutral-700 dark:text-neutral-300 transition-all active:scale-95">
            <TrendingUp size={16} className="text-emerald-500" strokeWidth={2.5} /> Review Appraisals
          </button>
        </div>
      </div>

      {/* 4. ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fleet by Brand */}
        <div className="rounded-2xl bg-white dark:bg-[#111318] p-6 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[18px] font-bold text-neutral-900 dark:text-white">Fleet by Brand</h2>
            <button onClick={() => setActiveTab("cars")} className="text-[13px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
              View all brands →
            </button>
          </div>
          <div className="space-y-5 flex-1">
            {brandAnalytics.length > 0 ? brandAnalytics.map((b) => (
              <div key={b.brand}>
                <div className="flex justify-between text-[14px] mb-2">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{b.brand}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-neutral-900 dark:text-white">{b.percentage}%</span>
                    <span className="text-[12px] font-semibold text-neutral-400 w-16 text-right">{b.count} Cars</span>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-800 h-2 rounded-full transition-all duration-1000" style={{ width: `${b.percentage}%` }}></div>
                </div>
              </div>
            )) : (
              <div className="h-full flex items-center justify-center text-[14px] font-medium text-neutral-400">No data available.</div>
            )}
          </div>
        </div>
        
        {/* Powertrain Mix */}
        <div className="rounded-2xl bg-white dark:bg-[#111318] p-6 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col items-center">
          <h2 className="text-[18px] font-bold text-neutral-900 dark:text-white mb-8 self-start">Powertrain Mix</h2>
          
          <div className="relative flex justify-center mb-8">
            <div 
              className="rounded-full shadow-inner" 
              style={{
                width: 160, 
                height: 160, 
                background: cars.length > 0 ? conicGradientStr : '#f5f5f5'
              }}
            >
              <div className="absolute inset-3 bg-white dark:bg-[#111318] rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-[32px] font-black text-neutral-900 dark:text-white leading-none">{cars.length}</span>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Vehicles</span>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center gap-6 text-[13px] font-bold">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-neutral-600"></div>
              <span className="text-neutral-700 dark:text-neutral-300">Gas <span className="text-neutral-900 dark:text-white ml-1">{gasPct}%</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-blue-500"></div>
              <span className="text-neutral-700 dark:text-neutral-300">Hybrid <span className="text-neutral-900 dark:text-white ml-1">{hybridPct}%</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-emerald-500"></div>
              <span className="text-neutral-700 dark:text-neutral-300">EV <span className="text-neutral-900 dark:text-white ml-1">{evPct}%</span></span>
            </div>
          </div>
        </div>

        {/* Operational Overview */}
        <div className="rounded-2xl bg-white dark:bg-[#111318] p-6 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col">
          <h2 className="text-[18px] font-bold text-neutral-900 dark:text-white mb-6">Operational Overview</h2>
          <div className="space-y-8 flex-1 justify-center flex flex-col">
            <div>
              <div className="flex justify-between items-end mb-2.5">
                <span className="text-[14px] font-bold text-neutral-700 dark:text-neutral-300">Lead Follow-Up</span>
                <div className="flex items-center gap-3">
                  <span className="text-[20px] font-black text-neutral-900 dark:text-white">{inquiryResponseRate}%</span>
                  <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Good</span>
                </div>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div className="bg-neutral-800 h-2.5 rounded-full" style={{ width: `${inquiryResponseRate}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2.5">
                <span className="text-[14px] font-bold text-neutral-700 dark:text-neutral-300">VIP Drive Readiness</span>
                <div className="flex items-center gap-3">
                  <span className="text-[20px] font-black text-neutral-900 dark:text-white">{driveConfirmRate}%</span>
                  <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Perfect</span>
                </div>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div className="bg-neutral-800 h-2.5 rounded-full" style={{ width: `${driveConfirmRate}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2.5">
                <span className="text-[14px] font-bold text-neutral-700 dark:text-neutral-300">Appraisal Approval</span>
                <div className="flex items-center gap-3">
                  <span className="text-[20px] font-black text-neutral-900 dark:text-white">{appraisalApproval}%</span>
                  <span className="text-[12px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">Reviewing</span>
                </div>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div className="bg-neutral-800 h-2.5 rounded-full" style={{ width: `${appraisalApproval}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 5. TODAY'S ACTIVITY */}
        <div className="rounded-2xl bg-white dark:bg-[#111318] p-6 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none lg:col-span-1 h-full flex flex-col">
          <h2 className="text-[18px] font-bold text-neutral-900 dark:text-white mb-6">Today's Activity</h2>
          <div className="flex-1">
            {recentActivities.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                {recentActivities.map((act, idx) => (
                  <div key={act.id} className="relative flex items-start gap-4">
                    <div className="absolute left-2 -translate-x-1/2 mt-1.5 size-2.5 rounded-full bg-emerald-600 ring-4 ring-white z-10" />
                    <div className="pl-6 w-full">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[14px] font-bold text-neutral-900 dark:text-white">{act.title}</span>
                        <span className="text-[12px] font-bold text-neutral-400">{act.timeStr}</span>
                      </div>
                      <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-500">{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="size-12 rounded-full bg-neutral-50 dark:bg-white/5 flex items-center justify-center mb-3">
                  <Activity size={20} className="text-neutral-300" />
                </div>
                <p className="text-[14px] font-bold text-neutral-900 dark:text-white">No activity yet today</p>
                <p className="text-[13px] text-neutral-500 dark:text-neutral-500 mt-1">Things are quiet in the showroom.</p>
              </div>
            )}
          </div>
        </div>

        {/* 6. RECENT INQUIRIES */}
        <div className="rounded-2xl bg-white dark:bg-[#111318] p-6 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none lg:col-span-2 flex flex-col h-full">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-bold text-neutral-900 dark:text-white">Recent Customer Inquiries</h2>
            <button onClick={() => setActiveTab("inquiries")} className="text-[13px] font-bold text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:text-neutral-900 transition-colors flex items-center gap-1 group">
              View All <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-white/5">
                  <th className="pb-3 text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Customer</th>
                  <th className="pb-3 text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Vehicle</th>
                  <th className="pb-3 text-[12px] font-bold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">Message</th>
                  <th className="pb-3 text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-[12px] font-bold text-neutral-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {inquiries.slice(0, 4).map((inq) => (
                  <tr key={inq.id} className="group hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 pr-4">
                      <p className="font-bold text-[14px] text-neutral-900 dark:text-white whitespace-nowrap">{inq.name}</p>
                      <p className="text-[12px] font-medium text-neutral-500 dark:text-neutral-500 mt-0.5">{inq.created_at?.split('T')[0] || "Today"}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <p className="font-bold text-[14px] text-neutral-700 dark:text-neutral-300">{inq.car_name || inq.subject || "General Inquiry"}</p>
                    </td>
                    <td className="py-4 pr-4 hidden sm:table-cell">
                      <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-500 max-w-[200px] truncate">"{inq.message}"</p>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        inq.status === 'Pending' ? 'bg-orange-50 text-orange-600 border border-orange-200/50' :
                        inq.status === 'Contacted' ? 'bg-blue-50 text-blue-600 border border-blue-200/50' :
                        'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {onUpdateInquiryStatus && inq.status === "Pending" && (
                        <button 
                          onClick={() => onUpdateInquiryStatus(inq.id, "Contacted")}
                          className="text-[12px] font-bold text-white bg-neutral-900 hover:bg-neutral-800 px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          Contact
                        </button>
                      )}
                      {onUpdateInquiryStatus && inq.status === "Contacted" && (
                        <button 
                          onClick={() => onUpdateInquiryStatus(inq.id, "Resolved")}
                          className="text-[12px] font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:text-neutral-900 border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#111318] hover:bg-neutral-50 dark:hover:bg-white/5 hover:bg-neutral-50 px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {inquiries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <p className="text-[15px] font-bold text-neutral-900 dark:text-white">No pending inquiries</p>
                      <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-500 mt-1">You're all caught up.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 7. UPCOMING TEST DRIVES */}
      <div className="rounded-2xl bg-white dark:bg-[#111318] p-6 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-neutral-900 dark:text-white">Upcoming Test Drives</h2>
          <button onClick={() => setActiveTab("test_drives")} className="text-[13px] font-bold text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:text-neutral-900 transition-colors flex items-center gap-1 group">
            View Schedule <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {testDrives.slice(0, 4).map(td => (
            <div key={td.id} className="group bg-white dark:bg-[#111318] border border-neutral-200/80 dark:border-white/10 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-[0_8px_30px_rgb(4,120,87,0.08)] transition-all duration-300 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  td.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' :
                  td.status === 'Completed' ? 'bg-neutral-100 dark:bg-white/10 text-neutral-500 dark:text-neutral-500 border border-neutral-200/50' :
                  'bg-orange-50 text-orange-600 border border-orange-200/50'
                }`}>
                  {td.status}
                </span>
                
                {onUpdateTestDriveStatus && td.status === "Pending" && (
                  <button onClick={() => onUpdateTestDriveStatus(td.id, "Confirmed")} className="text-[12px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95">Confirm</button>
                )}
                {onUpdateTestDriveStatus && td.status === "Confirmed" && (
                  <button onClick={() => onUpdateTestDriveStatus(td.id, "Completed")} className="text-[12px] font-bold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#111318] border border-neutral-200 dark:border-white/15 hover:bg-neutral-50 dark:hover:bg-white/5 hover:bg-neutral-50 px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95">Complete</button>
                )}
              </div>
              
              <h4 className="font-bold text-[15px] text-neutral-900 dark:text-white truncate mb-1" title={td.car_name}>{td.car_name}</h4>
              <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-500 mb-5">{td.customer_name}</p>
              
              <div className="mt-auto flex items-center gap-2.5 text-[13px] font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-white/5 p-3 rounded-xl border border-neutral-100 dark:border-white/5">
                <Clock size={16} className="text-emerald-600" strokeWidth={2.5} />
                {td.appointment_date} at {td.time_slot}
              </div>
            </div>
          ))}
          {testDrives.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
              <div className="size-12 rounded-full bg-neutral-50 dark:bg-white/5 flex items-center justify-center mb-3 border border-neutral-100 dark:border-white/5">
                <Calendar size={20} className="text-neutral-300" />
              </div>
              <p className="text-[15px] font-bold text-neutral-900 dark:text-white">No upcoming test drives</p>
              <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-500 mt-1">Your schedule is clear.</p>
            </div>
          )}
        </div>
      </div>

      {/* 8. FEATURED VEHICLES */}
      <div className="rounded-2xl bg-white dark:bg-[#111318] p-6 border border-neutral-200/60 shadow-\[0_2px_10px_-4px_rgba\(0\,0\,0\,0\.05\)\] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-neutral-900 dark:text-white">Featured Vehicles</h2>
          <button onClick={() => setActiveTab("cars")} className="text-[13px] font-bold text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:text-neutral-900 transition-colors flex items-center gap-1 group">
            View All <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredInventory.map(car => (
            <div key={car.id} className="group rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#111318] overflow-hidden hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
              
              <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-white/10 overflow-hidden">
                <Image 
                  src={car.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Condition Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white/95 backdrop-blur text-neutral-900 dark:text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    {car.condition}
                  </span>
                </div>
                
                {/* Featured Toggle */}
                {onToggleFeatured && (
                  <button 
                    onClick={() => onToggleFeatured(car.id)}
                    className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm transition-all duration-300 active:scale-95 text-[11px] font-bold uppercase tracking-wider ${car.featured ? 'bg-amber-400 text-white shadow-amber-400/20' : 'bg-white/95 backdrop-blur text-neutral-500 dark:text-neutral-500 hover:text-amber-500 hover:bg-white'}`}
                    title={car.featured ? "Remove from Featured" : "Mark as Featured"}
                  >
                    {car.featured ? (
                      <>
                        <Star size={12} className="fill-current" /> Featured
                      </>
                    ) : (
                      <>
                        <Star size={12} /> Feature
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[11px] font-black uppercase tracking-widest text-emerald-700 mb-1.5">{car.year} {car.brand}</p>
                <h3 className="font-extrabold text-neutral-900 dark:text-white leading-tight mb-2 text-[16px]">{car.model}</h3>
                <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-500 mb-6">{number(car.mileage)} mi • {car.fuel_type} • {car.body_type}</p>
                
                <div className="mt-auto flex items-center justify-between border-t border-neutral-100 dark:border-white/5 pt-4">
                  <span className="text-[18px] font-black text-neutral-900 dark:text-white tracking-tight">{money(car.price).replace(/\.00$/, '')}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveTab("cars")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#111318] text-[12px] font-bold text-neutral-700 dark:text-neutral-300 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm active:scale-95">
                      <Edit2 size={12} strokeWidth={2.5} /> Edit
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
          {filteredInventory.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-neutral-200 dark:border-white/15 rounded-2xl">
              <div className="size-12 rounded-full bg-neutral-50 dark:bg-white/5 flex items-center justify-center mb-3">
                <Car size={20} className="text-neutral-300" />
              </div>
              <p className="text-[15px] font-bold text-neutral-900 dark:text-white mb-1">No vehicles in your showroom yet.</p>
              <button onClick={() => setActiveTab("cars")} className="text-[13px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
                + Add Vehicle
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
