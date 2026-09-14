"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAdmin) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [isAdmin, isLoading, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f6f6f4]">
      <div className="size-10 rounded-full border-3 border-neutral-300 border-t-[#ef3f32] animate-spin" />
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
        Redirecting...
      </p>
    </div>
  );
}
