"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ShieldAlert, Lock, ArrowRight, LogOut, ArrowLeft } from "lucide-react";
import { ADMIN_EMAIL } from "@/lib/constants";

const AUTHORIZED_ADMIN_EMAIL = ADMIN_EMAIL;

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();

  // If not logged in, redirect to dedicated /admin/login page
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.replace("/admin/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f6f4] py-20">
        <div className="size-10 rounded-full border-3 border-neutral-300 border-t-[#ef3f32] animate-spin" />
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
          Verifying Admin Authorization...
        </p>
      </div>
    );
  }

  // Not logged in -> Redirecting to /admin/login
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f4] px-4 py-16">
        <div className="card max-w-md w-full p-8 md:p-10 text-center shadow-xl border border-neutral-200">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-xs">
            <Lock size={28} />
          </div>
          <p className="eyebrow mt-5 text-[#ef3f32]">Restricted Access</p>
          <h2 className="serif mt-2 text-2xl font-bold text-neutral-900">
            Admin Authentication Required
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            Redirecting to the secure Admin Portal login...
          </p>
          <div className="mt-6">
            <Link
              href="/admin/login"
              className="btn btn-dark w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>Go to Admin Sign In</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in, but NOT the authorized super admin
  if (!isAdmin || user.email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f4] px-4 py-16">
        <div className="card max-w-lg w-full p-8 md:p-10 text-center shadow-xl border border-neutral-200">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-[#ef3f32] border border-red-200 shadow-xs">
            <ShieldAlert size={32} />
          </div>
          <p className="eyebrow mt-5 text-[#ef3f32]">Access Restricted</p>
          <h2 className="serif mt-2 text-2xl font-bold text-neutral-900">
            Admin Privileges Required
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            You are signed in as <span className="font-bold text-neutral-900">{user.email}</span> (Role:{" "}
            <span className="font-bold uppercase text-neutral-700">{user.role}</span>). This portal is strictly
            restricted to the system administrator (<span className="font-bold text-neutral-900">{AUTHORIZED_ADMIN_EMAIL}</span>).
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              className="btn btn-dark flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              <span>Switch to Admin Account</span>
            </button>
            <Link
              href="/"
              className="btn btn-light flex-1 py-3 text-xs font-bold border border-neutral-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>Return to Showroom</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Super Admin
  return <>{children}</>;
}
