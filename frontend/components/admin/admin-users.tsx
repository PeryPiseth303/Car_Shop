"use client";

import React, { useEffect, useState } from "react";
import { Users, ShieldCheck, UserCheck, RefreshCw, Lock, Mail, Calendar } from "lucide-react";
import { AuthUser, apiGetUsers } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

export function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetUsers(token);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  return (
    <div className="card overflow-hidden shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-50/80 p-4">
        <div>
          <h2 className="font-bold text-neutral-900">
            Registered Users & Accounts ({users.length})
          </h2>
          <p className="text-xs text-neutral-400">
            Accounts authenticated via OTP verification with role assignments
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="btn btn-light py-1.5 px-3 text-xs font-bold border border-neutral-200 flex items-center gap-1.5"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-xs border-b border-red-100">
          {error}
        </div>
      )}

      <div className="divide-y divide-neutral-100">
        {users.map((u) => (
          <div key={u.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-neutral-50/50 transition">
            <div className="flex items-center gap-3">
              <div className={`grid size-10 place-items-center rounded-xl font-black text-xs ${
                u.role === "admin" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700"
              }`}>
                {u.full_name?.charAt(0) || "U"}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900">{u.full_name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      u.role === "admin"
                        ? "bg-[#ef3f32]/10 text-[#ef3f32] border border-[#ef3f32]/20"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {u.role === "admin" ? "👑 Admin" : "👤 Client"}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Mail size={12} />
                    {u.email}
                  </span>
                  {u.created_at && (
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Calendar size={12} />
                      Joined: {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold ${
                u.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700"
              }`}>
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>{u.is_active ? "Active" : "Deactivated"}</span>
              </span>
            </div>
          </div>
        ))}

        {users.length === 0 && !loading && (
          <div className="p-10 text-center text-xs text-neutral-400">
            No users registered.
          </div>
        )}
      </div>
    </div>
  );
}
