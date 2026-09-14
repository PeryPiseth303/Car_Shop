"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function SellPage() {
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
  }, [isLoading, isAdmin, router]);

  return null;
}
