"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { apiAddToCart, apiRemoveFromCart } from "@/lib/api";

export type LocalCarKey = "favorites" | "cart";

const changeEvent = "local-cars-change";

function readIds(key: LocalCarKey) {
  try {
    // If key is cart or favorites, check both to ensure seamless sync
    let raw = localStorage.getItem(key);
    if (!raw && key === "cart") {
      raw = localStorage.getItem("favorites");
    } else if (!raw && key === "favorites") {
      raw = localStorage.getItem("cart");
    }
    const value: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(value) && value.every((id) => typeof id === "string")
      ? JSON.stringify(value)
      : "[]";
  } catch {
    return "[]";
  }
}

export function useLocalCars(key: LocalCarKey) {
  const subscribe = useCallback((onChange: () => void) => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || (key === "cart" && event.key === "favorites") || (key === "favorites" && event.key === "cart")) {
        onChange();
      }
    };
    const onLocalChange = (event: Event) => {
      const detail = (event as CustomEvent<LocalCarKey>).detail;
      if (detail === key || (key === "cart" && detail === "favorites") || (key === "favorites" && detail === "cart")) {
        onChange();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(changeEvent, onLocalChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(changeEvent, onLocalChange);
    };
  }, [key]);

  const snapshot = useSyncExternalStore(
    subscribe,
    () => readIds(key),
    () => "[]",
  );
  const ids = useMemo<string[]>(() => JSON.parse(snapshot), [snapshot]);

  const toggle = useCallback((id: string) => {
    const current: string[] = JSON.parse(readIds(key));
    const isAdding = !current.includes(id);
    const next = isAdding
      ? [...current, id]
      : current.filter((currentId) => currentId !== id);

    if (key === "favorites" || key === "cart") {
      localStorage.setItem("favorites", JSON.stringify(next));
      localStorage.setItem("cart", JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(changeEvent, { detail: "favorites" }));
      window.dispatchEvent(new CustomEvent(changeEvent, { detail: "cart" }));
    } else {
      localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(changeEvent, { detail: key }));
    }

    // If favorites/cart and user is logged in, sync to backend database under user's email
    if (key === "favorites" || key === "cart") {
      try {
        const savedUser = localStorage.getItem("aurelia_auth_user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed?.email) {
            if (isAdding) {
              apiAddToCart(parsed.email, id).catch(console.error);
            } else {
              apiRemoveFromCart(parsed.email, id).catch(console.error);
            }
          }
        }
      } catch {
        // Local state preserved even if network fails
      }
    }
  }, [key]);

  return { ids, toggle };
}

