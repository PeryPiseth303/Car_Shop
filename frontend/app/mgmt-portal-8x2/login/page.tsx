"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Gauge,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { ADMIN_EMAIL } from "@/lib/constants";

const AUTHORIZED_ADMIN_EMAIL = ADMIN_EMAIL;

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isLoading, login, verifyOTP, resendOTP, logout } = useAuth();

  // Admin form state
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [maskedEmail, setMaskedEmail] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already authenticated as super admin, redirect to /admin
  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin) {
      router.replace("/mgmt-portal-8x2");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Step 1: Submit Admin Credentials
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailTrimmed = adminEmail.trim().toLowerCase();
    if (emailTrimmed !== AUTHORIZED_ADMIN_EMAIL) {
      setErrorMessage("Access Denied: Invalid administrator credentials. Please try again.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your administrator password.");
      return;
    }

    setFormLoading(true);
    try {
      const res = await login(emailTrimmed, password);
      setMaskedEmail(res.masked_email || emailTrimmed);
      setStep("otp");
      setResendTimer(60);
      setSuccessMessage("Security verification code dispatched to your email. Please enter the 6-digit OTP.");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid administrator credentials. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Step 2: Handle OTP Digits (Manual typing only, no auto-verify)
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6);
      if (pasted.length > 0) {
        const newCode = [...otpCode];
        for (let i = 0; i < 6; i++) {
          newCode[i] = pasted[i] || "";
        }
        setOtpCode(newCode);
        const nextIndex = Math.min(pasted.length, 5);
        inputRefs.current[nextIndex]?.focus();
        return;
      }
    }

    const digit = value.slice(-1).replace(/\D/g, "");
    const newCode = [...otpCode];
    newCode[index] = digit;
    setOtpCode(newCode);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && otpCode.join("").length === 6) {
      handleVerifyOTP();
    }
  };

  const handleVerifyOTP = async () => {
    const code = otpCode.join("");
    if (code.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setFormLoading(true);
    setErrorMessage(null);

    try {
      await verifyOTP(adminEmail.trim().toLowerCase(), code, "login");
      setSuccessMessage("Admin authentication verified! Redirecting to Admin Dashboard...");
      setTimeout(() => {
        router.push("/mgmt-portal-8x2");
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid or expired OTP code.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setFormLoading(true);
    setErrorMessage(null);
    try {
      await resendOTP(adminEmail.trim().toLowerCase(), "login");
      setResendTimer(60);
      setSuccessMessage("A fresh verification code has been dispatched.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend code.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-50/30 text-neutral-900 flex flex-col items-center justify-center px-4 py-12 selection:bg-emerald-600 selection:text-white">
      {/* Background Ambience Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-radial from-emerald-600/5 via-emerald-600/5 to-transparent blur-3xl opacity-70" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top Header Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 font-black tracking-tight group">
            <span className="grid size-11 place-items-center rounded-2xl bg-emerald-900 text-white shadow-[0_4px_20px_-4px_rgba(4,120,87,0.3)] group-hover:scale-105 group-hover:bg-emerald-800 transition-all duration-300">
              <Gauge size={22} strokeWidth={2.5} />
            </span>
            <span className="text-2xl font-black tracking-tighter text-neutral-900">
              AURELIA<span className="text-emerald-600">.</span>
            </span>
          </Link>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-0.5 text-[11px] font-bold text-emerald-700">
              <Lock size={11} className="text-emerald-600" />
              <span>Admin Management Hub</span>
            </span>
            <span className="rounded-full bg-neutral-200/60 px-2 py-0.5 text-[10px] font-mono font-bold text-neutral-500">
              RESTRICTED
            </span>
          </div>
        </div>

        {/* Existing Client Account Notice */}
        {isAuthenticated && user && !isAdmin && (
          <div className="mb-6 rounded-2xl border border-orange-200/60 bg-orange-50/50 p-4 text-xs text-orange-800">
            <div className="flex items-center gap-2 font-bold text-orange-700 mb-1">
              <AlertCircle size={15} />
              <span>Client Account Currently Active</span>
            </div>
            <p className="text-[11px] text-orange-700/80 leading-relaxed">
              Signed in as <span className="font-bold text-neutral-900">{user.email}</span>. Only{" "}
              <span className="font-bold text-neutral-900">{AUTHORIZED_ADMIN_EMAIL}</span> can access the Admin Hub.
            </p>
            <button
              type="button"
              onClick={logout}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-lg transition"
            >
              <LogOut size={13} />
              <span>Sign Out to Admin</span>
            </button>
          </div>
        )}

        {/* Card */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] backdrop-blur-2xl">
          {step === "credentials" ? (
            <div>
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                  Super Admin Authentication
                </p>
                <h1 className="serif mt-1.5 text-2xl sm:text-3xl font-bold text-neutral-900">
                  Sign In to Admin
                </h1>
                <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                  Enter administrator credentials to authenticate and receive your 6-digit OTP verification code.
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-100 p-3.5 text-xs text-red-600 animate-in fade-in">
                  <AlertCircle size={16} className="shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-700">Authorized Admin Email</label>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">
                      SUPER ADMIN
                    </span>
                  </div>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3 pl-10 pr-4 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Administrator Password
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3 pl-10 pr-11 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 text-xs font-bold shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-[0.99]"
                  >
                    <span>{formLoading ? "Authenticating..." : "Authenticate & Send OTP"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition mb-3"
                >
                  <ArrowLeft size={14} />
                  <span>Back to credentials</span>
                </button>
                <h1 className="serif text-2xl font-bold text-neutral-900">
                  Enter Admin OTP Code
                </h1>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                  Dispatched a 6-digit verification code to{" "}
                  <span className="font-bold text-neutral-900">{maskedEmail || AUTHORIZED_ADMIN_EMAIL}</span>
                </p>
              </div>

              {/* Error / Success Feedback */}
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-600">
                  <AlertCircle size={15} className="shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && !errorMessage && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-700">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* 6 Digit Inputs (Manual typing only) */}
              <div>
                <div className="flex justify-between gap-2 sm:gap-3 my-4">
                  {otpCode.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="size-12 rounded-xl border border-neutral-200 bg-neutral-50 text-center font-mono text-xl font-bold text-neutral-900 shadow-2xs transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={formLoading || otpCode.join("").length !== 6}
                className="w-full rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 text-xs font-bold shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-[0.99]"
              >
                <span>{formLoading ? "Verifying Access..." : "Verify & Launch Admin Portal"}</span>
                <CheckCircle2 size={15} />
              </button>

              {/* Resend OTP */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-xs">
                <span className="text-neutral-500">Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || formLoading}
                  className={`font-bold transition flex items-center gap-1.5 ${
                    resendTimer > 0
                      ? "text-neutral-400 cursor-not-allowed"
                      : "text-emerald-700 hover:underline"
                  }`}
                >
                  <RotateCcw size={13} />
                  <span>
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend OTP"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Return to Customer Showroom */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition"
          >
            <ArrowLeft size={13} />
            <span>Return to Customer Showroom</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
